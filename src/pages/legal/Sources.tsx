
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sources = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">SchoolConnect</span>
          </div>
          <h1 className="text-4xl font-bold">Sources</h1>
          <p className="text-purple-100 mt-2">References and attributions used in this project</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Stock Images</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>Unsplash. (2024). <em>Woman sitting on bed using laptop</em> [Photograph]. Retrieved from https://images.unsplash.com/photo-1649972904349-6e44c42644a7</p>
              
              <p>Unsplash. (2024). <em>Turned on gray laptop computer</em> [Photograph]. Retrieved from https://images.unsplash.com/photo-1488590528505-98d2b5aba04b</p>
              
              <p>Unsplash. (2024). <em>Macro photography of black circuit board</em> [Photograph]. Retrieved from https://images.unsplash.com/photo-1518770660439-4636190af475</p>
              
              <p>Unsplash. (2024). <em>Monitor showing Java programming</em> [Photograph]. Retrieved from https://images.unsplash.com/photo-1461749280684-dccba630e2f6</p>
              
              <p>Unsplash. (2024). <em>Person using MacBook Pro</em> [Photograph]. Retrieved from https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Resources</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>GitHub, Inc. (2024). <em>GitHub Pages documentation: Getting started with GitHub Pages</em>. GitHub Docs. Retrieved from https://docs.github.com/en/pages/getting-started-with-github-pages</p>
              
              <p>GitHub, Inc. (2024). <em>GitHub fundamentals: Understanding the GitHub flow</em>. GitHub Docs. Retrieved from https://docs.github.com/en/get-started/quickstart/github-flow</p>
              
              <p>Supabase. (2024). <em>Supabase documentation: Getting started guide</em>. Supabase Docs. Retrieved from https://supabase.com/docs/guides/getting-started</p>
              
              <p>Supabase. (2024). <em>Authentication with Supabase Auth</em>. Supabase Docs. Retrieved from https://supabase.com/docs/guides/auth</p>
              
              <p>Supabase. (2024). <em>Database design with PostgreSQL</em>. Supabase Docs. Retrieved from https://supabase.com/docs/guides/database</p>
              
              <p>Microsoft Corporation. (2024). <em>Visual Studio Code user guide: Getting started</em>. Visual Studio Code Documentation. Retrieved from https://code.visualstudio.com/docs</p>
              
              <p>Microsoft Corporation. (2024). <em>Visual Studio Code: Extensions marketplace</em>. Visual Studio Code Documentation. Retrieved from https://code.visualstudio.com/docs/editor/extension-marketplace</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Development Frameworks & Libraries</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>Meta Platforms, Inc. (2024). <em>React documentation: Getting started</em>. React. Retrieved from https://react.dev/learn</p>
              
              <p>Vercel. (2024). <em>Vite guide: Getting started</em>. Vite. Retrieved from https://vitejs.dev/guide/</p>
              
              <p>Tailwind Labs. (2024). <em>Tailwind CSS documentation</em>. Tailwind CSS. Retrieved from https://tailwindcss.com/docs</p>
              
              <p>shadcn. (2024). <em>shadcn/ui component library</em>. shadcn/ui. Retrieved from https://ui.shadcn.com/</p>
              
              <p>TanStack. (2024). <em>React Query documentation: Getting started</em>. TanStack Query. Retrieved from https://tanstack.com/query/latest/docs/framework/react/overview</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Educational Resources</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>Mozilla Developer Network. (2024). <em>Web development guides: HTML, CSS, and JavaScript</em>. MDN Web Docs. Retrieved from https://developer.mozilla.org/en-US/docs/Learn</p>
              
              <p>W3Schools. (2024). <em>TypeScript tutorial</em>. W3Schools. Retrieved from https://www.w3schools.com/typescript/</p>
              
              <p>freeCodeCamp. (2024). <em>Full stack web development curriculum</em>. freeCodeCamp. Retrieved from https://www.freecodecamp.org/learn</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Design & UX Resources</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>Google LLC. (2024). <em>Material Design guidelines</em>. Google Design. Retrieved from https://material.io/design</p>
              
              <p>Apple Inc. (2024). <em>Human Interface Guidelines</em>. Apple Developer. Retrieved from https://developer.apple.com/design/human-interface-guidelines/</p>
              
              <p>Nielsen Norman Group. (2024). <em>Web usability guidelines</em>. Nielsen Norman Group. Retrieved from https://www.nngroup.com/articles/</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Sources;
