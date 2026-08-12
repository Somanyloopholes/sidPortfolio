import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { projects, skillsList, type Project } from '../data/projects';
import ReactMarkdown from 'react-markdown';

const getMarkdownComponents = (textClass: string = "text-tertiary-text") => ({
  p: ({ children }: any) => <p className={`text-body-prose ${textClass} leading-relaxed mb-4 last:mb-0`}>{children}</p>,
  a: ({ children, href }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-hero-accent hover:underline">{children}</a>,
  strong: ({ children }: any) => <strong className="text-secondary-text font-bold">{children}</strong>,
  ul: ({ children }: any) => <ul className={`list-disc list-inside mb-4 ${textClass}`}>{children}</ul>,
  li: ({ children }: any) => <li className="mb-1">{children}</li>,
  img: ({ src, alt }: any) => (
    <div className="w-full my-6 flex items-center justify-center">
      <img src={src} alt={alt} className="max-w-full h-auto object-contain border border-hero-accent/30 bg-[#0a0a0a]" />
    </div>
  )
});

const CustomGithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-full"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  </svg>
);

const AbstractBanner = () => (
  <div className="w-full h-32 md:h-48 bg-[#141413] flex items-center justify-center border-b border-hero-accent relative overflow-hidden">
    {/* Dithered / Abstract Geometry Pattern */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#A6D800_1px,transparent_1px)] [background-size:16px_16px]" />
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-hero-accent z-10">
      <rect x="10" y="10" width="60" height="60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="40" cy="40" r="16" stroke="currentColor" strokeWidth="2" />
      <path d="M40 10V70M10 40H70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
    </svg>
  </div>
);

export default function ProjectsPage() {
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerContainerRef.current;
    const inner = scrollContainerRef.current;
    if (!outer || !inner) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();
        
        // Native smooth scrolling to mimic Lenis momentum
        inner.scrollBy({
          left: e.deltaY * 1.5,
          behavior: 'smooth'
        });
      }
    };

    outer.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => outer.removeEventListener('wheel', handleWheel);
  }, []);

  const [activeSkills, setActiveSkills] = useState<string[]>(["All"]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev => {
      if (skill === "All") return ["All"];
      const newSkills = prev.filter(s => s !== "All");
      if (newSkills.includes(skill)) {
        const toggled = newSkills.filter(s => s !== skill);
        return toggled.length === 0 ? ["All"] : toggled;
      }
      return [...newSkills, skill];
    });
  };

  const filteredProjects = projects.filter(p => 
    activeSkills.includes("All") || activeSkills.some(skill => p.skills.includes(skill))
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset'; 
      document.documentElement.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-0 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Skill Filter Bar */}
      <div ref={outerContainerRef} className="w-full border border-hero-accent px-2 py-1 md:px-4 md:py-2 mb-6 bg-[#141413]">
        <div ref={scrollContainerRef} className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 overflow-x-auto overflow-y-hidden w-full pb-2">
          {skillsList.map(skill => {
            const isActive = activeSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-2 py-1 text-micro-tag rounded-none border border-hero-accent transition-colors duration-200 whitespace-nowrap shrink-0 ${
                  isActive 
                  ? 'bg-hero-accent text-primary-background' 
                  : 'bg-transparent text-tertiary-text hover:text-secondary-text hover:bg-hero-accent/10'
                }`}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Matrix */}
      <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-x-4 gap-y-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            // Determine column span based on row type pattern (3 items, 4 items)
            // Indices: 0,1,2 (span-4) | 3,4,5,6 (span-3)
            const cycle = index % 7;
            const spanClass = cycle < 3 ? 'md:col-span-4' : 'md:col-span-3';

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`w-full ${spanClass} border border-hero-accent bg-[#141413] cursor-pointer rounded-none flex flex-col hover:border-hero-accent transition-colors group relative`}
              >
                {project.coverImage ? (
                  <div className="w-full border-b border-hero-accent relative bg-black shrink-0">
                    <img src={project.coverImage} alt={project.title} className="w-full h-auto block opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <AbstractBanner />
                )}
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="text-sub-heading text-secondary-text group-hover:text-hero-accent transition-colors uppercase tracking-wide">{project.title}</h3>
                  <p className="text-body-prose text-tertiary-text line-clamp-3">{project.shortDescription}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-primary-background/70 backdrop-blur-md"
            />
            <div 
              className="fixed inset-0 z-[70] overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onClick={() => setSelectedProject(null)}
              style={{ overscrollBehavior: 'contain' }}
              data-lenis-prevent="true"
            >
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-5xl mx-auto my-4 md:my-12 bg-[#141413] border border-hero-accent rounded-none flex flex-col shadow-[0_0_40px_rgba(166,216,0,0.15)] overflow-hidden"
                >
                  <div className="w-full flex flex-col relative">
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-primary-background border border-hero-accent text-hero-accent hover:bg-hero-accent hover:text-primary-background transition-colors z-50"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="p-6 md:p-10 flex flex-col gap-8 shrink-0">
                      
                      {/* Top Section: Image (Left) + Details (Right) */}
                      <div className="flex flex-col md:flex-row gap-8 items-start w-full mt-12 md:mt-0">
                        {/* Left: Image */}
                        <div className="w-full md:w-[45%] shrink-0">
                          {selectedProject.coverImage ? (
                            <div className="w-full border border-hero-accent relative bg-black">
                              <img src={selectedProject.coverImage} alt={selectedProject.title} className="w-full h-auto block opacity-90" />
                            </div>
                          ) : (
                            <div className="w-full border border-hero-accent">
                              <AbstractBanner />
                            </div>
                          )}
                        </div>

                        {/* Right: Title, Skills, Role */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col gap-4 w-full md:w-[55%] md:pr-12"
                        >
                          <h2 className="text-section-heading text-secondary-text uppercase tracking-wide">{selectedProject.title}</h2>
                          
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.skills.map(skill => (
                              <span key={skill} className="px-3 py-1 border border-hero-accent/50 text-hero-accent text-micro-tag bg-hero-accent/5 uppercase">
                                {skill}
                              </span>
                            ))}
                          </div>

                        </motion.div>
                      </div>

                      {/* Role and Description */}
                      {(selectedProject.role || selectedProject.fullDescription) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col gap-4"
                        >
                          {selectedProject.role && (
                            <p className="text-micro-tag text-tertiary-text uppercase tracking-widest">{selectedProject.role}</p>
                          )}
                          {selectedProject.fullDescription && (
                            <ReactMarkdown components={getMarkdownComponents("text-secondary-text")}>
                              {selectedProject.fullDescription}
                            </ReactMarkdown>
                          )}
                        </motion.div>
                      )}

                    {selectedProject.keyResults && selectedProject.keyResults.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-hero-accent/20">
                        {selectedProject.keyResults.map((kr, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span className="text-section-heading text-hero-accent">{kr.value}</span>
                            <span className="text-micro-tag text-secondary-text uppercase tracking-widest">{kr.label}</span>
                            {kr.note && <span className="text-[10px] text-tertiary-text leading-tight mt-1">{kr.note}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                  {/* New detailed sections */}
                  {(selectedProject.problemStatement || selectedProject.architecture || selectedProject.methodology || selectedProject.challenges || selectedProject.techStack || selectedProject.impactsAndKeyTakeaways) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex flex-col gap-8"
                    >
                      {selectedProject.problemStatement && (
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Problem Statement</h4>
                          <ReactMarkdown components={getMarkdownComponents()}>{selectedProject.problemStatement}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.architecture && (
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Architecture</h4>
                          <ReactMarkdown components={getMarkdownComponents()}>{selectedProject.architecture}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.methodology && (
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Methodology</h4>
                          <ReactMarkdown components={getMarkdownComponents()}>{selectedProject.methodology}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Challenges</h4>
                          <div className="flex flex-col gap-6">
                            {selectedProject.challenges.map((challenge, idx) => (
                              <div key={idx} className="flex flex-col gap-1">
                                <h5 className="text-body-prose text-secondary-text font-bold">{challenge.title}</h5>
                                <ReactMarkdown components={getMarkdownComponents()}>{challenge.description}</ReactMarkdown>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProject.impactsAndKeyTakeaways && (
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Impacts & Key Takeaways</h4>
                          <ReactMarkdown components={getMarkdownComponents()}>{selectedProject.impactsAndKeyTakeaways}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Detailed Tech Stack</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {selectedProject.techStack.map((item, idx) => (
                              <div key={idx} className="flex flex-col border-b border-hero-accent/10 pb-2">
                                <div className="flex justify-between items-baseline">
                                  <span className="text-body-prose text-secondary-text font-bold">{item.name}</span>
                                  {item.version && <span className="text-micro-tag text-tertiary-text font-mono">{item.version}</span>}
                                </div>
                                <span className="text-micro-tag text-hero-accent/70 uppercase tracking-widest mt-1">{item.category}</span>
                                {item.note && <span className="text-sm text-tertiary-text mt-1">{item.note}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Media Showcase */}
                  {selectedProject.media && selectedProject.media.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <h4 className="text-sub-heading text-secondary-text uppercase tracking-widest">Media Showcase</h4>
                      <div className="flex flex-col gap-4">
                        {selectedProject.media.map((mediaUrl, idx) => (
                          mediaUrl.endsWith('.mp4') ? (
                            <video key={idx} src={mediaUrl} autoPlay loop muted playsInline className="w-full border border-hero-accent/30 bg-[#0a0a0a]" />
                          ) : (
                            <img key={idx} src={mediaUrl} alt={`${selectedProject.title} media ${idx + 1}`} className="w-full h-auto object-cover border border-hero-accent/30 bg-[#0a0a0a]" />
                          )
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="w-full aspect-video border border-hero-accent/30 bg-hero-accent/5 flex items-center justify-center relative overflow-hidden"
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(166,216,0,0.05)_50%,transparent_75%,transparent_100%)] [background-size:20px_20px]" />
                       <span className="text-hero-accent/50 text-sub-heading tracking-widest font-mono z-10">MEDIA SHOWCASE</span>
                    </motion.div>
                  )}
                  
                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 pt-8 border-t border-hero-accent/20"
                  >
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-hero-accent text-primary-background text-micro-tag hover:bg-[#bbf000] transition-colors border border-hero-accent font-bold uppercase tracking-widest">
                      <ExternalLink size={16} /> View Live Project
                    </a>
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-transparent text-secondary-text border border-hero-accent hover:bg-hero-accent/10 transition-colors text-micro-tag uppercase tracking-widest">
                      <CustomGithubIcon className="size-4" /> GitHub Repository
                    </a>
                  </motion.div>
                </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
