export function ShippingPartners() {
  const partners = ["DHL", "Deutsche Post", "Post.at", "Swiss Post", "DPD"];

  return (
    <section className="py-12 border-t" style={{ borderColor: "rgba(31,59,50,0.08)", background: "var(--color-ivory)" }}>
      <div className="container-content">
        <div className="text-center mb-6">
          <div className="eyebrow" style={{ color: "var(--color-muted)" }}>
            Premium Versandpartner
          </div>
        </div>
        <div className="flex justify-center items-center gap-x-10 sm:gap-x-14 gap-y-4 flex-wrap">
          {partners.map((p) => (
            <span
              key={p}
              className="serif text-xl sm:text-2xl whitespace-nowrap"
              style={{ color: "var(--color-muted)", opacity: 0.55 }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
