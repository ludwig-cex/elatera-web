import type { Metadata } from "next";

export const metadata: Metadata = { title: "Widerrufsrecht" };

export default function Page() {
  return (
    <div className="py-16 sm:py-20">
      <div className="container-content max-w-2xl">
        <div className="eyebrow mb-3">Rechtliches</div>
        <h1 className="serif text-4xl sm:text-5xl leading-tight mb-6">Widerrufsbelehrung</h1>
        <p className="text-muted leading-relaxed mb-8">
          Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Verbraucher ist jede natürliche
          Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer
          gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.
        </p>

        <h2 className="serif text-2xl mb-3">Widerrufsrecht</h2>
        <p className="text-muted leading-relaxed mb-6">
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
          widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von
          Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben
          beziehungsweise hat.
        </p>
        <p className="text-muted leading-relaxed mb-6">
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
          <br />
          <br />
          HEALTH POINT MEDIA LTD
          <br />
          Laura Schneider
          <br />
          Suite A Bank House, 81 Judes Road
          <br />
          Egham, TW20 0DF, United Kingdom
          <br />
          E-Mail: kundenservice@nutrasana.de
          <br />
          <br />
          mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der Post versandter Brief oder eine
          E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür
          das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
          Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>

        <h2 className="serif text-2xl mb-3">Folgen des Widerrufs</h2>
        <p className="text-muted leading-relaxed mb-6">
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
          erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
          sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn
          Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags
          bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie
          bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
          ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung
          Entgelte berechnet.
        </p>
        <p className="text-muted leading-relaxed mb-6">
          Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis
          Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches
          der frühere Zeitpunkt ist. Sie haben die Waren unverzüglich und in jedem Fall spätestens
          binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags
          unterrichten, an uns zurückzusenden oder zu übergeben. Sie tragen die unmittelbaren Kosten der
          Rücksendung der Waren. Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn
          dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise
          der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
        </p>

        <h2 className="serif text-2xl mb-3">Erlöschen des Widerrufsrechts</h2>
        <p className="text-muted leading-relaxed mb-6">
          Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus
          Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre
          Versiegelung nach der Lieferung entfernt wurde.
        </p>

        <h2 className="serif text-2xl mb-3">Muster-Widerrufsformular</h2>
        <p className="text-muted leading-relaxed mb-6">
          (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie
          es zurück.)
        </p>
        <div
          className="rounded-lg p-5 mb-6 text-sm leading-relaxed text-muted"
          style={{ background: "var(--color-cream)" }}
        >
          An: HEALTH POINT MEDIA LTD, Suite A Bank House, 81 Judes Road, Egham, TW20 0DF, United
          Kingdom, E-Mail: kundenservice@nutrasana.de
          <br />
          <br />
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
          der folgenden Waren (*):
          <br />
          <br />
          — Bestellt am (*) / erhalten am (*):
          <br />
          — Name des/der Verbraucher(s):
          <br />
          — Anschrift des/der Verbraucher(s):
          <br />
          — Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
          <br />
          — Datum:
          <br />
          <br />
          (*) Unzutreffendes streichen.
        </div>
      </div>
    </div>
  );
}
