const sampleTags = ['python', 'javascript', 'html', 'css', 'node', 'ai', 'ml', 'web', 'data', 'frontend'];

const sampleModules = (title) => [
  { title: `${title} - Module 1`, content: 'Intro and Basics' },
  { title: `${title} - Module 2`, content: 'Intermediate Concepts' },
  { title: `${title} - Module 3`, content: 'Project/Practice' }
];

const generateSampleCourses = (count = 10) => {
  const courses = [];

  for (let i = 1; i <= count; i++) {
    const tag = sampleTags[i % sampleTags.length];
    const title = `Course ${i}: ${tag.toUpperCase()} Essentials`;

    courses.push({
      title,
      description: `Learn the fundamentals of ${tag}.`,
      tags: [tag],
      modules: sampleModules(title),
    });
  }

  return courses;
};

module.exports = generateSampleCourses;
