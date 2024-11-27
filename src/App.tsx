import { About } from './components/About';
import { Collapse, CollapseContent, CollapseTrigger } from './components/Collapse';
import { Header } from './components/Header';
import { Item } from './components/Item';
import { Title } from './components/Title';
import './index.css';

const App = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Header />

      <Title iconUrl="/profile.png" title="Moshe Bukhman">
        <p className="mb-2 text-xl text-secondary">Full Stack & DevOps Developer</p>
        <p className="text-sm text-gray-400 opacity-70">Devoted father of two and husband.</p>
        <p className="text-sm text-gray-400 opacity-40">
          <a href="https://www.instagram.com/wheresmyfoodfrom_jerusalem/" target="_blank" rel="noreferrer">
            Photographer
          </a>
          ,{' '}
          <a href="https://vimeo.com/moshebukhman" target="_blank" rel="noreferrer">
            videographer
          </a>
          , and{' '}
          <a href="https://youtu.be/LHJWmi-sI0c" target="_blank" rel="noreferrer">
            tap dancer
          </a>
          .
        </p>
      </Title>

      <About>
        <p className="text-pretty">
          Hi, I'm Moshe. I am a results-driven software engineer with{' '}
          <strong>{new Date().getFullYear() - 2019}+ years</strong> of experience delivering high-performance,{' '}
          <strong>scalable</strong> solutions. Proven record in optimizing workflows and implementing cost-effective
          strategies. Passionate <strong>problem-solver</strong> with expertise in{' '}
          <strong>JavaScript/TypeScript</strong> and <strong>cloud</strong> technologies. <strong>Multilingual</strong>{' '}
          communicator able to effectively collaborate with diverse teams.
        </p>
      </About>

      <Collapse withTeaser>
        <CollapseTrigger>
          <h2 className="my-10 mt-14 leading-snug text-white">Skills</h2>
        </CollapseTrigger>
        <CollapseContent>
          <Item
            title="Core"
            tags={['JS', 'TS', 'Node.js', 'Python', 'Bash', 'HTML', 'CSS', 'React', 'Next.js', 'NestJS', 'Express']}
            shortGutter
          />
          <Item
            title="DevOps & Cloud"
            tags={['AWS (EKS, Lambda)', 'Kubernetes', 'Docker', 'Terraform', 'ArgoCD', 'CI/CD pipelines']}
            shortGutter
          />
          <Item
            title="Databases & APIs"
            tags={['MongoDB', 'Firebase', 'DynamoDB', 'MySQL', 'PostgreSQL', 'NoSQL/SQL', 'GraphQL', 'RESTful']}
            shortGutter
          />
          <Item
            title="Frontend"
            tags={['MUI', 'Shadcn', 'DataGrids', 'Zustand', 'Context API', 'Responsive Design', 'SVG graphics']}
            shortGutter
          />
          <Item
            title="Testing & Tools"
            tags={['Jest', 'Vitest', 'Selenium', 'Puppeteer', 'Git', 'JIRA', 'GitLab', 'GitHub actions']}
            shortGutter
          />
          <Item
            title="Methodologies"
            tags={['TDD', 'DRY', 'SOLID', 'Agile', 'Microservices', 'Serverless']}
            shortGutter
          />
        </CollapseContent>
      </Collapse>

      <h2 className="mb-8 mt-16">Work Experience</h2>

      <Item
        title="Oct 2023 - present"
        link={{ href: 'https://github.com/delivops', text: 'Full Stack & DevOps Developer – Delivops' }}
        description={
          <ul className="list-inside list-none space-y-1">
            <li>Architected scalable SAAS for deployment automation with Next.js, NestJS, K8s API.</li>
            <li>Optimized AWS infrastructures with Terraform, reducing deployment times by 50%.</li>
            <li>Implemented Kubernetes GPU sharing, cut costs by 30%, increased performance by x50.</li>
            <li>
              Developed{' '}
              <a href="https://github.com/delivops/argocd-notifier" target="_blank" rel="noreferrer">
                real-time deployment notifier
              </a>{' '}
              (NodeJS), enhancing customer satisfaction.
            </li>
          </ul>
        }
        image={{ src: '/delivops.png', alt: 'Delivops logo' }}
        tags={['Next.js', 'NestJS', 'K8s API', 'Terraform', 'AWS']}
      />
      <Item
        title="May 2023 - present"
        link={{ href: 'https://jonni.app', text: 'Full Stack Developer – Jonni' }}
        description="Engineered financial data imports and complex forms using AWS, Node.js, React, GraphQL."
        image={{ src: '/jonni.svg', alt: 'Jonni logo' }}
        tags={['AWS', 'Node.js', 'React', 'GraphQL']}
      />
      <Item
        title="Apr 2021 - Oct 2023"
        link={{ href: 'https://rubybot.co.il', text: 'Full Stack Developer – Ruby AI' }}
        description="Developed AI bots for Telegram/WhatsApp and chat UI using Python, Docker, Next.js."
        image={{ src: '/ruby.webp', alt: 'Rubybot logo' }}
        tags={['Python', 'Docker', 'Next.js']}
      />
      <Item
        title="Feb 2021 - Aug 2023"
        link={{ href: 'https://yaizy.io', text: 'Developer & Leading Educator – Yaizy-Algorithmica' }}
        description={
          <ul className="list-inside list-none space-y-1">
            <li>Automated student setups, reducing onboarding time by 80%.</li>
            <li>Promoted to headmaster, innovated teaching methods.</li>
          </ul>
        }
        image={{ src: '/yaizy.svg', alt: 'Yaizy logo' }}
        tags={['Python', 'Docker', 'Next.js']}
      />
      <Item
        title="Previous Experience"
        description={
          <ul className="list-inside list-none space-y-1">
            <li>
              <img
                alt="kucherenkoalexander.com logo"
                src="/kucherenkoalexander.jpg"
                className="my-2 me-2 inline-block h-6 w-auto"
              />
              <a href="https://kucherenkoalexander.com" target="_blank" rel="noreferrer">
                kucherenkoalexander.com
              </a>
              <br />
              Automated video production, enhanced quality and speed.
            </li>
            <li>
              <img alt="abp.biz logo" src="/abp.jpeg" className="my-2 me-2 inline-block h-6 w-auto" />
              <a href="https://abp.biz" target="_blank" rel="noreferrer">
                abp.biz
              </a>
              <br />
              Managed development of 40 websites, SEO, and CMS (PHP, C# .NET).
            </li>
            <li>
              <img alt="DCom logo" src="/dcom.png" className="my-2 me-2 inline-block h-6 w-auto" />
              DCom
              <br />
              Designed VOIP networks, established e-commerce platform, led customer support team.
            </li>
          </ul>
        }
      />

      <h2 className="mb-8 mt-16">Personal Projects</h2>

      <Item
        title="2023 - ongoing"
        link={{ href: 'https://sandwicheck.app', text: 'SandwiCheck App' }}
        image={{ src: '/sandwicheck.jpeg' }}
        description={
          <>
            Full-stack MERN family meal planner
            <ul className="list-inside list-none space-y-1">
              <li>Implemented visual sandwich builder with dietary preferences, users management</li>
              <li>Reduced deployment time by 90% with CI/CD using GitHub Actions and Docker</li>
            </ul>
          </>
        }
        tags={['MERN', 'Docker', 'MongoDB', 'Node.js', 'React', 'Express', 'CI/CD']}
        bigImage
      />

      <Item
        title="2023"
        link={{ href: 'https://mbukh.github.io/Minecraft-2.5D/game.html', text: 'Minecraft 2.5D' }}
        image={{ src: '/minecraft.jpeg' }}
        description={
          <>
            Interactive vanilla JS tile map editor
            <ul className="list-inside list-none space-y-1">
              <li>Map generation (Perlin/Simplex Noise algorithms), tile editing, adjustable zoom</li>
              <li>Made with a custom React-inspided engine</li>
            </ul>
          </>
        }
        tags={['Vanilla JS']}
        bigImage
      />

      <Item
        title="2023"
        link={{ href: 'https://github.com/mbukh/Proxy-Crawler-Checker', text: 'Proxy Crawler & Checker' }}
        description={
          <>
            An open-source Python CLI tool for finding proxy servers
            <ul className="list-inside list-none space-y-1">
              <li>Modularized and configurable crawler (Selenium)</li>
              <li>Anonymous proxy detector</li>
              <li>Multithreading</li>
            </ul>
          </>
        }
        tags={['Python', 'Selenium', 'Multithreading']}
        bigImage
      />

      <Item
        title="2023"
        link={{ href: 'https://mbukh.github.io/Roll-and-Dice-Animation-Game/', text: 'Roll and Dice Animation Game' }}
        image={{ src: 'roll-and-dice.jpg' }}
        description={
          <>
            A dice game built with vanilla JS/CSS
            <ul className="list-inside list-none space-y-1">
              <li>CSS animations, real-time generated SVG graphics.</li>
              <li>Designed with the MVC model in mind.</li>
            </ul>
          </>
        }
        tags={['Vanilla JS', 'CSS', 'SVG', 'MVC']}
        bigImage
      />

      <Item
        title="2023"
        link={{ href: 'https://mbukh.github.io/Amazon-Page-Pixel-Perfecting/', text: 'Amazon Page Pixel-Perfecting' }}
        image={{ src: 'amazon.jpg' }}
        description="A pixel-perfect recreation of the Amazon page using, HTML, CSS and a bit of JavaScript."
        tags={['HTML', 'CSS']}
        bigImage
      />

      <Item
        title="2023"
        link={{ href: 'https://marvel-vs-dc-cards.netlify.app', text: 'Marvel vs. DC Trivia Card Game' }}
        image={{ src: '/marvel-vs-dc.jpg' }}
        description={
          <>
            A React.js Heroes matching game
            <ul className="list-inside list-none space-y-1">
              <li>Swipe superheroes and supervillains with mouse or keyboard</li>
              <li>Enjoyable animations, image preloading, and event debouncing</li>
            </ul>
          </>
        }
        tags={['React.js', 'CSS', 'Animations']}
        bigImage
      />

      <h2 className="mb-8 mt-16">Education</h2>

      <Item
        title="2022 - 2023"
        description="Full Stack Advanced Course, Appleseeds Bootcamp (completed with excellence)"
        shortGutter
      />
      <Item title="2006 - 2007" description="M.Sc. in Network Security" shortGutter />
      <Item title="2002 - 2006" description="B.Sc. in Computer Science, Odessa National University" shortGutter />
      <Item
        title="2017 - 2021"
        description="B.A. in Photographic Communication, Hadassah Academic College"
        shortGutter
      />

      <h2 className="mb-8 mt-16">Links</h2>

      <Item title="Phone" description="053-5310485" shortGutter />
      <Item title="Email" link={{ href: 'mailto:mbukhman@gmail.com', text: 'mbukhman@gmail.com' }} shortGutter />
      <Item title="Github" link={{ href: 'https://github.com/mbukh', text: '@mbukh' }} shortGutter />
      <Item title="LinkedIn" link={{ href: 'https://linkedin.com/in/mbukhman', text: '@mbukhman' }} />
      <Item title="Facebook" link={{ href: 'https://facebook.com/mbukhman', text: '@mbukhman' }} shortGutter />
    </div>
  );
};

export default App;
