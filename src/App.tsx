import About from './components/About';
import Header from './components/Header';
import { Item } from './components/Item';
import Title from './components/Title';
import './index.css';

const App = () => {
  return (
    <div className="mx-auto max-w-[500px] px-[0.85rem] py-28">
      <Header />

      <Title iconUrl="/profile.png" title="Moshe Bukhman">
        <p className="">Software Engineer</p>
        <p className="text-secondary">Full Stack | DevOps</p>
      </Title>

      <About>
        <p className="text-balance">
          GM, I'm Max. I enjoy building dynamic, creative products from start to finish. Focused on developing intuitive
          experiences that constantly grow and improve based on user metrics. Always shipping.
        </p>
      </About>

      <h2 className="mb-10 mt-14 leading-snug text-white">Work Experience</h2>

      <Item
        title="2022 - present"
        link={{ href: 'https://iyk.app', text: 'Senior Frontend Engineer – IYK' }}
        description="Building the Whole Wide World﹡"
        tags={['Remix', 'Prisma', 'Tailwind', 'Shadcn']}
      />

      <h2 className="mb-10 leading-snug text-white">Side Projects</h2>

      <Item
        title="ongoing"
        image={{ src: '/dolenn-single.png' }}
        link={{ href: 'https://www.instagram.com/dolenn.bzh', text: 'Dolenn - Hot Sauce' }}
        description="Making hot sauces with a friend, made in Brittany with local ingredients."
        tags={['Design', 'Illustration', 'Packaging', 'Cooking']}
      />
      <Item
        title="ongoing"
        image={{ src: '/dolenn-single.png' }}
        link={{ href: 'https://www.instagram.com/dolenn.bzh', text: 'Dolenn - Hot Sauce' }}
        description="Making hot sauces with a friend, made in Brittany with local ingredients."
        tags={['Design', 'Illustration', 'Packaging', 'Cooking']}
      />

      <h2 className="mb-10 leading-snug text-white">Links</h2>

      <Item title="Github" link={{ href: 'https://github.com/maximebonhomme', text: '@maximebonhomme' }} shortGutter />
      <Item title="Github" link={{ href: 'https://github.com/maximebonhomme', text: '@maximebonhomme' }} shortGutter />
    </div>
  );
};

export default App;
