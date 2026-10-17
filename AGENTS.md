<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the immersive boutique renderer dynamically imported and initialize Three.js only after hydration; SSR must never initialize WebGL.
- Drive entrance and gallery scenes from native document scrolling without body scroll locks, so visitors can always move onward.
- Keep collection membership in the shared collections module and render collection views through TanStack routes, so navigation and products stay consistent.
