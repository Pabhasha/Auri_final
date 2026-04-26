const AboutSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
          About <span className="text-primary text-glow">Auri</span>
        </h2>

        <div className="space-y-5 text-muted-foreground text-base sm:text-lg leading-relaxed font-light">
          <p>
            Auri is a virtual performer whose voice was created from recorded sounds.
            They don't have a traditional background or history. Instead, Auri exists
            through music — every song they create is a way of expressing something new.
          </p>
          <p>
            Auri's voice may sound slightly different, but that's what makes it unique.
            Through simple melodies and sounds, Auri connects with listeners in a way
            that feels both new and familiar.
          </p>
          <p>
            Auri's purpose is simple: to create music and share it with the world.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
