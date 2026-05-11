export function PressLogos() {
  const logos = [
    "Frankfurter Rundschau",
    "Die Welt",
    "Handelsblatt",
    "Süddeutsche Zeitung",
    "Apotheken Umschau",
    "FAZ",
  ];
  return (
    <section className="py-10 overflow-hidden">
      <div className="container-content">
        <div className="eyebrow text-center mb-6">Bekannt aus</div>
        <div className="flex justify-center items-center gap-x-10 sm:gap-x-14 gap-y-4 flex-wrap opacity-50">
          {logos.map((l) => (
            <span key={l} className="serif text-xl leading-none whitespace-nowrap">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
