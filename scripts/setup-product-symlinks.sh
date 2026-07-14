#!/bin/bash
# Copies real files into public/products/<key>/ from asset-library/produkte/<key>/.
# We use real files (not symlinks) because Vercel's build cannot follow symlinks
# that point outside the repo root (../../../asset-library/...).
#
# Renames asset-library filenames to match elatera-web's products.ts:
#   solo.png        ← packshot.png
#   stillleben.png  ← packshot_stillleben.png
#   nutrients.png   ← nutrient_table.png
#   claims.png      ← claims_tile.png
#   credentials.png ← credentials_tile.png
#   hero.png        ← hero_slide.png
#   qualitaet.png   ← universal/qualitaet.png  (shared)
#   benefits/       ← (entire folder, real files)
#   lifestyle/      ← (entire folder, real files; iteration_alt/ excluded)
#   ingredients/<slug-with-dashes>.png ← inhaltsstoffe/closeups/<slug_with_underscores>.png
#
# Existing files for vertisana/mobilisana/somnisana are LEFT UNTOUCHED —
# this script only fills in the 6 new products. Re-run any time the
# asset-library source changes to refresh.

set -e
cd "$(dirname "$0")/.."   # → elatera-web/

CRED=../asset-library

# Replace target with a real file copy (cp -L follows symlinks at source if any).
# Uses cp -f to overwrite. Idempotent.
copy_file() {
  local src="$1" dst="$2"
  rm -f "$dst"
  cp -L "$src" "$dst"
}

# Replace target dir with real-file copies of source dir contents.
# Removes any existing symlink/dir first. Idempotent.
copy_dir() {
  local src="$1" dst="$2"
  rm -rf "$dst"
  mkdir -p "$dst"
  # -L = dereference symlinks at source, -R = recursive
  cp -RL "$src/." "$dst/"
}

# Per-product ingredient lists (bindestrich-slug:underscore-source)
ingredients_for() {
  case "$1" in
    mentisana)  echo "bacopa:bacopa ginkgo:ginkgo cholin:cholin ginseng:ginseng magnesium:magnesium vitamin-b6:vitamin_b6 vitamin-b12:vitamin_b12 zink:zink schwarzer-pfeffer:schwarzer_pfeffer" ;;
    urisana)    echo "saegepalme:saegepalme cranberry:cranberry kuerbiskern:kuerbiskern d-mannose:d_mannose vitamin-a:vitamin_a zink:zink selen:selen schwarzer-pfeffer:schwarzer_pfeffer" ;;
    tendisana)  echo "kollagen:kollagen bambussprossen:bambussprossen boswellia:boswellia bromelain:bromelain vitamin-c:vitamin_c vitamin-d:vitamin_d mangan:mangan zink:zink schwarzer-pfeffer:schwarzer_pfeffer" ;;
    gastrosana) echo "aloe-vera:aloe_vera suessholz-dgl:suessholz_dgl myrrhe:myrrhe l-carnosin:l_carnosin vitamin-a:vitamin_a vitamin-c:vitamin_c zink:zink schwarzer-pfeffer:schwarzer_pfeffer" ;;
    audisana)   echo "opc-traubenkern:opc_traubenkern l-citrullin:l_citrullin ginkgo:ginkgo magnesium:magnesium vitamin-c:vitamin_c vitamin-b1:vitamin_b1 vitamin-b6:vitamin_b6 vitamin-b12:vitamin_b12 zink:zink schwarzer-pfeffer:schwarzer_pfeffer" ;;
    cordisana)  echo "weissdorn:weissdorn olivenblatt:olivenblatt knoblauch:knoblauch magnesium:magnesium vitamin-c:vitamin_c vitamin-b1:vitamin_b1 selen:selen zink:zink schwarzer-pfeffer:schwarzer_pfeffer" ;;
  esac
}

for key in mentisana urisana tendisana gastrosana audisana cordisana; do
  echo "--- $key ---"
  dir="public/products/$key"
  # Wipe and rebuild — guarantees we're consistent with source.
  rm -rf "$dir"
  mkdir -p "$dir/ingredients"

  # Top-level files (with rename)
  copy_file "$CRED/produkte/$key/packshot.png"             "$dir/solo.png"
  copy_file "$CRED/produkte/$key/packshot_stillleben.png"  "$dir/stillleben.png"
  copy_file "$CRED/produkte/$key/flatlay.png"              "$dir/flatlay.png"
  copy_file "$CRED/produkte/$key/nutrient_table.png"       "$dir/nutrients.png"
  copy_file "$CRED/produkte/$key/claims_tile.png"          "$dir/claims.png"
  copy_file "$CRED/produkte/$key/credentials_tile.png"     "$dir/credentials.png"
  copy_file "$CRED/produkte/$key/hero_slide.png"           "$dir/hero.png"

  # Universal qualitaet tile (shared across products)
  copy_file "$CRED/universal/qualitaet.png" "$dir/qualitaet.png"

  # Benefits and lifestyle subdirs (exclude lifestyle/iteration_alt/)
  copy_dir "$CRED/produkte/$key/benefits"  "$dir/benefits"
  copy_dir "$CRED/produkte/$key/lifestyle" "$dir/lifestyle"
  rm -rf "$dir/lifestyle/iteration_alt"

  # Per-ingredient files (dash slug → underscore source)
  for pair in $(ingredients_for "$key"); do
    dash="${pair%%:*}"
    under="${pair##*:}"
    copy_file "$CRED/inhaltsstoffe/closeups/$under.png" "$dir/ingredients/$dash.png"
  done

  size=$(du -sh "$dir" | cut -f1)
  echo "  $(find "$dir" -type f | wc -l | tr -d ' ') files, $size in $dir/"
done

echo
echo "Done. Verify with: ls -la public/products/mentisana/"
