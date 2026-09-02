# AI providers

Three jobs, three providers. Each is optional — with none configured the app
still produces a plan, drawn posters and a storyboard, it just cannot render
photographs or video.

## Images — Higgsfield

```bash
HIGGSFIELD_API_KEY_ID=...
HIGGSFIELD_API_KEY_SECRET=...
```

Both are required. Higgsfield authenticates with a key **pair**
(`Authorization: Key <id>:<secret>`), not a bearer token, and it is
asynchronous: you submit a prompt, then poll a status URL until the request
reaches `completed`, `failed`, `nsfw` or `canceled`.

When these are set Higgsfield takes priority over the AI Gateway for stills,
because it is the look the marketing renders were made with.

Optional overrides:

```bash
HIGGSFIELD_BASE_URL=https://api.higgsfield.ai
HIGGSFIELD_MODEL_PATH=/higgsfield-ai/soul/v2/standard
```

## Video — Google Veo, through the Gemini API

```bash
GEMINI_API_KEY=...
KOALA_VEO_MODEL=veo-3.1-generate-preview   # optional
```

Veo is a long-running operation: submit to `:predictLongRunning`, then poll the
returned operation until `done`. The finished video sits behind a URI that
itself needs the API key, so the app downloads the bytes rather than handing
that URI to a browser. Generation takes minutes, not seconds.

Veo accepts **4, 6 or 8 seconds** and a first frame, which is where the
customer's product photo goes.

## Copy and storyboards — the AI Gateway

```bash
AI_GATEWAY_API_KEY=...        # or VERCEL_OIDC_TOKEN via `vercel env pull`
```

Used to write storyboards and refine copy. Without it, storyboards fall back to
a built-in three-beat template — a real advert structure, not a placeholder, so
the feature works either way. `storyboard.authored` tells you which one you got.

The gateway also needs a card on file before it will serve anything, even
inside the free credits.

## Why video goes through a storyboard

A video costs 20 credits; a storyboard costs 1.

Handing a video model one sentence produces one drifting shot where nothing
happens and the product changes between frames. Deciding the beats first — what
is on screen, for how long, and what the camera does — is most of the
difference between an advert and a screensaver.

So `POST /api/storyboard` writes the shot list, the customer reads and edits it,
and then `POST /api/generate` with `kind: "video"` takes that approved board.
If no board is supplied, one is written automatically from the same brief:
video is never generated from a bare sentence.

## Credits

New accounts are granted `SIGNUP_CREDITS` (30) on signup — roughly seven
images, or one video with a little left over. Enough to see the output, not
enough to run a free month.

| Action | Credits |
|---|---|
| Storyboard | 1 |
| Image | 4 |
| Video | 20 |

Credits are only charged **after** something is produced. A failed render costs
nothing, and the error says which key is missing rather than "not available".
