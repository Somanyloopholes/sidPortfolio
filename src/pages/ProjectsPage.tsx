import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { projects, skillsList, skillGroups, type Project, type SkillGroup } from '../data/projects';
import ReactMarkdown, { type ExtraProps } from 'react-markdown';
import ImageLightbox, { type LightboxImage } from '@/Components/ImageLightbox';

// `![grid-3: caption](/a.webp,/b.webp,/c.webp)` renders as a three-image grid with one caption.
const getGridCaption = (alt: string) => (alt.includes(':') ? alt.split(':')[1].trim() : null);
const getGridImageAlt = (caption: string | null, i: number, total: number) =>
  caption ? `${caption} (${i + 1} of ${total})` : `Image ${i + 1} of ${total}`;
const isPlaceholderAlt = (alt: string) => alt === 'Image' || alt === 'grid-3' || alt.startsWith('alt');
const normalizeSrc = (src: string) => {
  try {
    return decodeURIComponent(src).trim();
  } catch {
    return src.trim();
  }
};

const markdownImagePattern = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

// Every image in a case study, in the order the modal shows them, so the lightbox can step through all of them.
function collectCaseStudyImages(project: Project): LightboxImage[] {
  const fields = [
    project.fullDescription,
    project.problemStatement,
    project.architecture,
    project.methodology,
    ...(project.challenges ?? []).map(challenge => challenge.description),
    project.impactsAndKeyTakeaways,
  ];
  const images: LightboxImage[] = [];
  for (const field of fields) {
    if (!field) continue;
    for (const [, alt, src] of field.matchAll(markdownImagePattern)) {
      if (alt.startsWith('grid-3')) {
        const caption = getGridCaption(alt);
        const srcs = normalizeSrc(src).split(',');
        srcs.forEach((s, i) => images.push({ src: s.trim(), alt: getGridImageAlt(caption, i, srcs.length), caption }));
      } else {
        images.push({ src: normalizeSrc(src), alt, caption: alt && !isPlaceholderAlt(alt) ? alt : null });
      }
    }
  }
  return images;
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  onOpen?: (src: string) => void;
}

// A case-study image that opens in the lightbox when clicked; the border turns lime on hover and focus.
const ZoomableImage = ({ src, alt, onOpen }: ZoomableImageProps) => {
  const image = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full h-auto object-contain border border-subtle-border bg-primary-background transition-colors group-hover/zoom:border-hero-accent group-focus-visible/zoom:border-hero-accent"
    />
  );
  if (!onOpen) return image;
  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      aria-label={alt ? `Enlarge image: ${alt}` : 'Enlarge image'}
      className="group/zoom block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-accent"
    >
      {image}
    </button>
  );
};

const getMarkdownComponents = (textClass: string = "text-tertiary-text", onOpenImage?: (src: string) => void) => ({
  // The img renderer below outputs a <figure>, which is invalid inside <p>, so paragraphs holding an image render as a <div> with the same classes.
  p: ({ children, node }: { children?: React.ReactNode } & ExtraProps) => {
    const containsImage = node?.children.some(child => child.type === 'element' && child.tagName === 'img');
    const Tag = containsImage ? 'div' : 'p';
    return <Tag className={`text-body-prose ${textClass} leading-relaxed mb-4 last:mb-0`}>{children}</Tag>;
  },
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-hero-accent hover:underline">{children}</a>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-secondary-text font-bold">{children}</strong>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className={`list-disc list-inside mb-4 ${textClass}`}>{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="mb-1">{children}</li>,
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (alt?.startsWith('grid-3') && src) {
      const srcs = normalizeSrc(src).split(',');
      const caption = getGridCaption(alt);
      return (
        <figure className="w-full my-6 flex flex-col items-center justify-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {srcs.map((s: string, i: number) => (
              <div key={i} className="flex items-center justify-center">
                <ZoomableImage src={s.trim()} alt={getGridImageAlt(caption, i, srcs.length)} onOpen={onOpenImage} />
              </div>
            ))}
          </div>
          {caption && (
            <figcaption className="mt-3 text-micro-tag text-tertiary-text text-center w-full">{caption}</figcaption>
          )}
        </figure>
      );
    }
    const isSmallImg = src?.includes('IEEExIIT3.');
    return (
      <figure className={`w-full my-6 flex flex-col items-center justify-center ${isSmallImg ? 'max-w-[70%] md:max-w-[45%] mx-auto' : ''}`}>
        {src && <ZoomableImage src={normalizeSrc(src)} alt={alt ?? ''} onOpen={onOpenImage} />}
        {alt && !isPlaceholderAlt(alt) && (
          <figcaption className="mt-3 text-micro-tag text-tertiary-text text-center w-full">{alt}</figcaption>
        )}
      </figure>
    );
  }
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

const CustomFigmaIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M15 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M6 3m0 3a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v0a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3z" />
    <path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" />
  </svg>
);

const AbstractBanner = () => (
  <div className="w-full h-32 md:h-48 bg-primary-background flex items-center justify-center border-b border-hero-accent relative overflow-hidden">
    {/* Dithered / Abstract Geometry Pattern */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(var(--color-hero-accent)_1px,transparent_1px)] [background-size:16px_16px]" />
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
        // Let the page scroll once the chip row can't move any further in this direction.
        const maxScroll = inner.scrollWidth - inner.clientWidth;
        const canScroll = e.deltaY > 0 ? inner.scrollLeft < maxScroll - 1 : inner.scrollLeft > 0;
        if (!canScroll) return;

        e.preventDefault();
        e.stopPropagation();
        
        // Native smooth scrolling to mimic Lenis momentum (instant when reduced motion is requested)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        inner.scrollBy({
          left: e.deltaY * 1.5,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    };

    outer.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => outer.removeEventListener('wheel', handleWheel);
  }, []);

  // Selected filters live in the URL (?skills=a,b) so Back restores them.
  const [searchParams, setSearchParams] = useSearchParams();
  const skillsParam = searchParams.get('skills');
  const selectedSkills = skillsParam ? skillsParam.split(',').filter(s => s !== 'All' && skillsList.includes(s)) : [];
  const activeSkills = selectedSkills.length > 0 ? selectedSkills : ["All"];
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const lastOpenedIdRef = useRef<string | null>(null);

  const selectedProject = projectId ? projects.find(p => p.id === projectId) || null : null;

  // Case-study image lightbox. The open state is tied to a project id, so it closes by itself when the project modal closes.
  const [lightbox, setLightbox] = useState<{ projectId: string; index: number } | null>(null);
  const caseStudyImages = useMemo(() => (selectedProject ? collectCaseStudyImages(selectedProject) : []), [selectedProject]);
  const lightboxIndex = lightbox && selectedProject && lightbox.projectId === selectedProject.id ? lightbox.index : null;

  const openImage = useCallback((src: string) => {
    if (!selectedProject) return;
    const index = caseStudyImages.findIndex(image => image.src === src);
    if (index !== -1) setLightbox({ projectId: selectedProject.id, index });
  }, [selectedProject, caseStudyImages]);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeLightboxIndex = useCallback((index: number) => setLightbox(prev => prev && { ...prev, index }), []);

  const markdownComponents = useMemo(() => getMarkdownComponents("text-tertiary-text", openImage), [openImage]);
  const descriptionMarkdownComponents = useMemo(() => getMarkdownComponents("text-secondary-text", openImage), [openImage]);

  const handleSelectProject = (project: Project) => {
    lastOpenedIdRef.current = project.id;
    navigate({ pathname: `/projects/${project.id}`, search }, { preventScrollReset: true });
  };

  const handleClose = useCallback(() => {
    navigate({ pathname: '/projects', search }, { preventScrollReset: true });
  }, [navigate, search]);

  // Return keyboard focus to the card that opened the modal once it closes.
  useEffect(() => {
    if (selectedProject || !lastOpenedIdRef.current) return;
    const card = document.querySelector<HTMLElement>(`[data-project-id="${lastOpenedIdRef.current}"]`);
    lastOpenedIdRef.current = null;
    card?.focus();
  }, [selectedProject]);

  // Safe redirect if invalid projectId is entered in URL
  useEffect(() => {
    if (projectId && !projects.some(p => p.id === projectId)) {
      navigate('/projects', { replace: true });
    }
  }, [projectId, navigate]);

  // Update document title for deep-linked project pages
  useEffect(() => {
    if (selectedProject) {
      document.title = `${selectedProject.title} | Sid Geddam`;
    } else {
      document.title = 'Projects | Sid Geddam';
    }
  }, [selectedProject]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, handleClose]);

  const toggleSkill = (skill: string) => {
    let next: string[];
    if (skill === "All") next = [];
    else if (selectedSkills.includes(skill)) next = selectedSkills.filter(s => s !== skill);
    else next = [...selectedSkills, skill];
    setSearchParams(next.length > 0 ? { skills: next.join(',') } : {}, { replace: true, preventScrollReset: true });
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

  // Spread the skill groups across two scrollable rows, balanced by text length ("All" and the first group start row 1)
  const groupRows: SkillGroup[][] = [[], []];
  const rowChars = [0, 0];
  for (const group of skillGroups) {
    const row = rowChars[0] <= rowChars[1] ? 0 : 1;
    groupRows[row].push(group);
    rowChars[row] += group.label.length + group.skills.join('').length;
  }

  // Desktop jump list for long case studies; each id matches a section heading in the modal.
  const caseStudySections = selectedProject ? [
    { id: 'cs-problem', label: 'Problem', show: !!selectedProject.problemStatement },
    { id: 'cs-architecture', label: 'Architecture', show: !!selectedProject.architecture },
    { id: 'cs-methodology', label: 'Methodology', show: !!selectedProject.methodology },
    { id: 'cs-challenges', label: 'Challenges', show: !!selectedProject.challenges?.length },
    { id: 'cs-impact', label: 'Impact', show: !!selectedProject.impactsAndKeyTakeaways },
    { id: 'cs-tech-stack', label: 'Tech stack', show: !!selectedProject.techStack?.length },
  ].filter(section => section.show) : [];

  const jumpToSection = (id: string) => {
    const heading = document.getElementById(id);
    if (!heading) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    heading.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    heading.focus({ preventScroll: true });
  };

  const renderChip = (skill: string) => {
    const isActive = activeSkills.includes(skill);
    return (
      <button
        key={skill}
        onClick={() => toggleSkill(skill)}
        aria-pressed={isActive}
        className={`px-2 py-1 text-micro-tag rounded-none border border-hero-accent transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-secondary-text ${
          isActive
          ? 'bg-hero-accent text-primary-background'
          : 'bg-transparent text-tertiary-text hover:text-secondary-text hover:bg-hero-accent/10'
        }`}
      >
        {skill}
      </button>
    );
  };

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-0 pb-24 px-8 md:px-12 max-w-7xl mx-auto">
      <h1 className="sr-only">Projects</h1>

      {/* Skill Filter Bar */}
      <div ref={outerContainerRef} inert={!!selectedProject || undefined} className="w-full border border-subtle-border px-2 py-1 md:px-4 md:py-2 mb-3 bg-primary-background">
        <div ref={scrollContainerRef} className="flex flex-col gap-2 overflow-x-auto overflow-y-hidden w-full pb-1">
          {groupRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 w-max">
              {rowIndex === 0 && renderChip("All")}
              {row.flatMap(group => group.skills).map(renderChip)}
            </div>
          ))}
        </div>
      </div>

      <p className="w-full text-micro-tag text-tertiary-text mb-6" aria-live="polite">
        {selectedSkills.length === 0
          ? `Showing all ${projects.length} projects`
          : `Showing ${filteredProjects.length} of ${projects.length} projects that use any of: ${selectedSkills.join(', ')}`}
      </p>

      {/* Grid Matrix */}
      <div inert={!!selectedProject || undefined} className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            // Desktop (lg): alternating rows of 3 and 4 cards. Tablets get a plain two-column grid, phones one column.
            // Indices: 0,1,2 (span-4) | 3,4,5,6 (span-3)
            const cycle = index % 7;
            const spanClass = cycle < 3 ? 'lg:col-span-4' : 'lg:col-span-3';

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                key={project.id}
                onClick={() => handleSelectProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={project.title}
                data-project-id={project.id}
                className={`w-full ${spanClass} border border-hero-accent bg-primary-background cursor-pointer rounded-none flex flex-col hover:border-hero-accent transition-colors group relative overflow-hidden`}
              >
                {project.coverImage ? (
                  <div className="w-full border-b border-hero-accent relative bg-primary-background shrink-0">
                    <img src={project.coverImage} alt={project.title} width={1280} height={720} className="w-full h-auto block opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <AbstractBanner />
                )}
                <div className="p-6 flex flex-col gap-3 min-w-0 flex-1">
                  <h2 className="text-title-small text-secondary-text group-hover:text-hero-accent transition-colors break-words line-clamp-3">{project.title}</h2>
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
              className="fixed inset-0 z-[70] overflow-y-auto p-4 md:p-8"
              onClick={handleClose}
              style={{ overscrollBehavior: 'contain' }}
              data-lenis-prevent="true"
              // While an image is enlarged, the case study behind it can't be focused or clicked.
              inert={lightboxIndex !== null || undefined}
            >
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="project-modal-title"
                  className="w-full max-w-5xl mx-auto mb-4 md:mb-12 bg-primary-background border border-hero-accent rounded-none flex flex-col shadow-[0_0_40px_color-mix(in_srgb,var(--color-hero-accent)_15%,transparent)] overflow-hidden"
                >
                  <div className="w-full flex flex-col relative">
                    <button
                      onClick={handleClose}
                      aria-label="Close"
                      autoFocus
                      className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-primary-background border border-hero-accent text-hero-accent hover:bg-hero-accent hover:text-primary-background transition-colors z-50 after:absolute after:-inset-1.5 after:content-['']"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="px-4 py-6 md:p-10 flex flex-col gap-8 shrink-0">
                      
                      {/* Top Section: Image (Left) + Details (Right) */}
                      <div className="flex flex-col md:flex-row gap-8 items-start w-full mt-12 md:mt-0">
                        {/* Left: Image */}
                        <div className="w-full md:w-[45%] shrink-0">
                          {selectedProject.coverImage ? (
                            <div className="w-full border border-subtle-border relative bg-primary-background">
                              <img src={selectedProject.coverImage} alt={selectedProject.title} width={1280} height={720} className="w-full h-auto block opacity-90" />
                            </div>
                          ) : (
                            <div className="w-full border border-subtle-border">
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
                          <h2 id="project-modal-title" className="text-section-heading text-secondary-text">{selectedProject.title}</h2>
                          
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.skills.map(skill => (
                              <span key={skill} className="px-3 py-1 border border-hero-accent/50 text-hero-accent text-micro-tag bg-hero-accent/5 uppercase">
                                {skill}
                              </span>
                            ))}
                          </div>

                          {(selectedProject.liveUrl || selectedProject.githubUrl || selectedProject.figmaUrl) && (
                            <div className="flex flex-wrap gap-3 mt-4">
                              {selectedProject.liveUrl && (
                                <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-hero-accent text-primary-background text-micro-tag hover:opacity-80 transition-opacity border border-hero-accent font-bold uppercase tracking-widest">
                                  <ExternalLink size={16} /> View Live
                                </a>
                              )}
                              {selectedProject.githubUrl && (
                                <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-hero-accent text-primary-background text-micro-tag hover:opacity-80 transition-opacity border border-hero-accent font-bold uppercase tracking-widest">
                                  <CustomGithubIcon className="size-4" /> GitHub <ExternalLink size={14} className="ml-1" />
                                </a>
                              )}
                              {selectedProject.figmaUrl && (
                                <a href={selectedProject.figmaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-hero-accent text-primary-background text-micro-tag hover:opacity-80 transition-opacity border border-hero-accent font-bold uppercase tracking-widest">
                                  <CustomFigmaIcon className="size-4" /> Figma <ExternalLink size={14} className="ml-1" />
                                </a>
                              )}
                            </div>
                          )}

                        </motion.div>
                      </div>

                      {caseStudySections.length > 1 && (
                        <nav aria-label="Case study sections" className="hidden md:flex flex-wrap gap-x-5 gap-y-2 w-full md:w-[75%] max-w-[54ch] mx-auto">
                          {caseStudySections.map(section => (
                            <button
                              key={section.id}
                              type="button"
                              onClick={() => jumpToSection(section.id)}
                              className="text-micro-tag text-tertiary-text hover:text-hero-accent hover:underline underline-offset-4 transition-colors"
                            >
                              {section.label}
                            </button>
                          ))}
                        </nav>
                      )}

                      {/* Role and Description */}
                      {(selectedProject.role || selectedProject.fullDescription) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col gap-4 w-full md:w-[75%] max-w-[54ch] mx-auto"
                        >
                          {selectedProject.role && (
                            <p className="text-micro-tag text-tertiary-text">{selectedProject.role}</p>
                          )}
                          {selectedProject.fullDescription && (
                            <ReactMarkdown components={descriptionMarkdownComponents}>
                              {selectedProject.fullDescription}
                            </ReactMarkdown>
                          )}
                        </motion.div>
                      )}

                    {selectedProject.keyResults && selectedProject.keyResults.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-subtle-border">
                        {selectedProject.keyResults.map((kr, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span className="text-section-heading text-hero-accent">{kr.value}</span>
                            <span className="text-micro-tag text-secondary-text uppercase tracking-widest">{kr.label}</span>
                            {kr.note && <span className="text-micro-tag text-tertiary-text mt-1">{kr.note}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {(!selectedProject.keyResults || selectedProject.keyResults.length === 0) &&
                      (selectedProject.problemStatement || selectedProject.architecture || selectedProject.methodology || selectedProject.challenges || selectedProject.techStack || selectedProject.impactsAndKeyTakeaways) && (
                      <div className="w-full border-t border-subtle-border" />
                    )}

                  {/* New detailed sections */}
                  {(selectedProject.problemStatement || selectedProject.architecture || selectedProject.methodology || selectedProject.challenges || selectedProject.techStack || selectedProject.impactsAndKeyTakeaways) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex flex-col gap-8 w-full md:w-[75%] max-w-[54ch] mx-auto"
                    >
                      {selectedProject.problemStatement && (
                        <div className="flex flex-col gap-2">
                          <h3 id="cs-problem" tabIndex={-1} className="text-sub-heading text-secondary-text uppercase tracking-widest scroll-mt-6">Problem Statement</h3>
                          <ReactMarkdown components={markdownComponents}>{selectedProject.problemStatement}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.architecture && (
                        <div className="flex flex-col gap-2">
                          <h3 id="cs-architecture" tabIndex={-1} className="text-sub-heading text-secondary-text uppercase tracking-widest scroll-mt-6">Architecture</h3>
                          <ReactMarkdown components={markdownComponents}>{selectedProject.architecture}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.methodology && (
                        <div className="flex flex-col gap-2">
                          <h3 id="cs-methodology" tabIndex={-1} className="text-sub-heading text-secondary-text uppercase tracking-widest scroll-mt-6">Methodology</h3>
                          <ReactMarkdown components={markdownComponents}>{selectedProject.methodology}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 id="cs-challenges" tabIndex={-1} className="text-sub-heading text-secondary-text uppercase tracking-widest scroll-mt-6">Challenges</h3>
                          <div className="flex flex-col gap-6">
                            {selectedProject.challenges.map((challenge, idx) => (
                              <div key={idx} className="flex flex-col gap-1">
                                <h4 className="text-body-prose text-secondary-text font-bold">{challenge.title}</h4>
                                <ReactMarkdown components={markdownComponents}>{challenge.description}</ReactMarkdown>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProject.impactsAndKeyTakeaways && (
                        <div className="flex flex-col gap-2">
                          <h3 id="cs-impact" tabIndex={-1} className="text-sub-heading text-secondary-text uppercase tracking-widest scroll-mt-6">Impacts & Key Takeaways</h3>
                          <ReactMarkdown components={markdownComponents}>{selectedProject.impactsAndKeyTakeaways}</ReactMarkdown>
                        </div>
                      )}
                      {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 id="cs-tech-stack" tabIndex={-1} className="text-sub-heading text-secondary-text uppercase tracking-widest scroll-mt-6">Detailed Tech Stack</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {selectedProject.techStack.map((item, idx) => (
                              <div key={idx} className="flex flex-col border-b border-subtle-border pb-2">
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
                  

                </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ImageLightbox
        images={caseStudyImages}
        index={lightboxIndex}
        onIndexChange={changeLightboxIndex}
        onClose={closeLightbox}
      />

    </section>
  );
}
