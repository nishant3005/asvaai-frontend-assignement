export const getSummary = async (content, length) => {
  const summaries = {
    short: 'This is a short summary.',
    medium: 'This is a medium summary.',
    long: 'This is a long summary.',
  };

  return summaries[length] || summaries.medium;
};
