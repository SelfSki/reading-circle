## Lessons Learned

Never hardcode application configuration.
Separate data from rendering.
Good names reduce comments.
Debug using evidence instead of guesses.
Always verify one change before making another.
If CSS seems to be ignored:
    1. Check that every `{` has a matching `}`.
    2. Make sure selectors are not accidentally nested.
    3. Verify the rule appears in Developer Tools.
    4. Only then assume something more complicated is wrong.


## Design Principle

I don't mind doing a little more work today if it makes future changes obvious and simple.
Optimize for maintainability over convenience.

## UI Philosophy

The Reading Circle should feel like entering a quiet library.

## UI Design principles:

- Simplicity over decoration
- Plenty of whitespace
- Calm colors
- Strong typography
- Gentle animations
- Content first

## UI Rule

Every visual element must answer:
"Why is this shown to the user?"
If there isn't a clear answer, it probably shouldn't exist.

## UI Backlog

- Style the star rating.
- Generate stars dynamically from the rating value.
- Animate progress bar on page load.
- Replace placeholder covers with cached local images.
