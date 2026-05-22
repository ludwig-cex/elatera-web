#!/bin/bash
# Sets up symlinks under public/products/<key>/ pointing to
# credentials_output/produkte/<key>/. Renames credentials_output filenames
# to match the conventions used by elatera-web's products.ts:
#   solo.png        ← packshot.png
#   stillleben.png  ← packshot_stillleben.png
#   nutrients.png   ← nutrient_table.png
#   claims.png      ← claims_tile.png
#   credentials.png ← credentials_tile.png
#   hero.png        ← hero_slide.png
#   benefits/       ← (folder-symlink)
#   lifestyle/      ← (folder-symlink)
#   ingredients/<slug-with-dashes>.png ← inhaltsstoffe/closeups/<slug_with_underscores>.png
#
# Existing files for vertisana/mobilisana/somnisana are LEFT UNTOUCHED —
# this script only fills in mentisana/urisana/tendisana/gastrosana/audisana/cordisana.

set -e
cd "$(dirname "$0")/.."   # → elatera-web/

CRED=../credentials_output

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
  mkdir -p "$dir/ingredients"

  # Top-level file symlinks (with rename)
  ln -sf "../../../$CRED/produkte/$key/packshot.png"             "$dir/solo.png"
  ln -sf "../../../$CRED/produkte/$key/packshot_stillleben.png"  "$dir/stillleben.png"
  ln -sf "../../../$CRED/produkte/$key/flatlay.png"              "$dir/flatlay.png"
  ln -sf "../../../$CRED/produkte/$key/nutrient_table.png"       "$dir/nutrients.png"
  ln -sf "../../../$CRED/produkte/$key/claims_tile.png"          "$dir/claims.png"
  ln -sf "../../../$CRED/produkte/$key/credentials_tile.png"     "$dir/credentials.png"
  ln -sf "../../../$CRED/produkte/$key/hero_slide.png"           "$dir/hero.png"

  # Universal qualitaet tile (shared across products)
  ln -sf "../../../$CRED/universal/qualitaet.png" "$dir/qualitaet.png"

  # Folder symlinks (benefits/, lifestyle/)
  ln -sfn "../../../$CRED/produkte/$key/benefits"  "$dir/benefits"
  ln -sfn "../../../$CRED/produkte/$key/lifestyle" "$dir/lifestyle"

  # Per-ingredient symlinks (dash slug → underscore source)
  for pair in $(ingredients_for "$key"); do
    dash="${pair%%:*}"
    under="${pair##*:}"
    ln -sf "../../../../$CRED/inhaltsstoffe/closeups/$under.png" "$dir/ingredients/$dash.png"
  done

  echo "  $(ls "$dir" | wc -l | tr -d ' ') entries in $dir/"
done

echo
echo "Done. Verify with: ls -la public/products/mentisana/"
