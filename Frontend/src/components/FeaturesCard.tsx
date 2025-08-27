import { HoverEffect } from "./ui/card-hover-effect";
import features from "../utils/features.json";
import { Highlighter } from "./magicui/highlighter";
import { InView } from "./ui/in-view";

export function Features() {
  return (
    <InView>
      <div className="text-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold my-4 text-primary leading-tight">
          Divine{" "}
          <Highlighter action="underline" color="#FF9800">
            Features
          </Highlighter>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto">
          Discover the timeless wisdom of the Bhagavad Gita through modern
          technology.
        </p>
        <div className="max-w-6xl mx-auto mt-10 sm:mt-12 lg:mt-16 px-2 sm:px-4">
          <HoverEffect items={features} />
        </div>
      </div>
    </InView>
  );
}
