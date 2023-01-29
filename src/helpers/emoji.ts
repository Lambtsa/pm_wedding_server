/**
 * Randomly picks an emoji for the news article
 * @returns emoji string
 */
export const randomEmoji = (): string => {
  const random = Math.random();

  switch (true) {
    case random < 1 / 3: {
      return "📰";
    }
    case random < 2 / 3: {
      return "🗞";
    }
    default: {
      return "🚨";
    }
  }
};
