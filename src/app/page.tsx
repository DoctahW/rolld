import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-dark">
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/cook-becker/image/fetch/q_auto:good,f_auto,w_1920/https://candb.com/site/candb/images/artwork/players-handbook-2024-tyler-jacobson-dnd.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-black/40" />
      <header className="relative z-20 py-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            🎲 Rolld
          </h1>
        </div>
      </header>

      <div className="relative z-10 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Registrem sistemas que jogaram.
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Salve aqueles que querem jogar.
          </h3>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Definam de uma vez por todas qual o melhor sistema.
          </h3>
        </div>

        <Link
          href="/auth"
          className="inline-block bg-linear-to-r from-gold to-gold-light text-dark px-10 py-4 rounded-md font-bold text-lg hover:shadow-xl hover:shadow-gold/50 transition-all transform hover:scale-105"
        >
          Comece agora!
        </Link>

        <p className="mt-6 text-gold-pale text-base">
          A rede social para amantes de RPG de mesa.
        </p>
      </div>
    </main>
  );
}
