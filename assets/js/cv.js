// Procedural CV: builds a PDF from assets/data/cv.json with pdfmake.
// Inline markup in any text field: **bold** and [label](url).
(function () {
    const PAGE_WIDTH = 595.28; // A4 in pt
    const PAGE_MARGINS = [40, 34, 40, 34];
    const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGINS[0] - PAGE_MARGINS[2];
    const MIN_FONT_SIZE = 8.5;
    let pageCount = 0;
    let accent = '#1f3a5f';

    // ---------- inline markup -> pdfmake runs ----------
    function rich(str, base = {}) {
        const runs = [];
        const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
        let last = 0, m;
        while ((m = re.exec(str)) !== null) {
            if (m.index > last) runs.push({ text: str.slice(last, m.index), ...base });
            if (m[1] !== undefined) runs.push({ text: m[1], ...base, bold: true });
            else runs.push({ text: m[2], ...base, link: m[3], color: accent });
            last = re.lastIndex;
        }
        if (last < str.length) runs.push({ text: str.slice(last), ...base });
        return runs;
    }

    // Emulates LaTeX \scshape: capitals at full size, lowercase as smaller capitals.
    function smallCaps(str, size, extra = {}) {
        return Array.from(str).map(ch => ({
            text: ch.toUpperCase(),
            fontSize: ch !== ch.toUpperCase() ? size * 0.78 : size,
            ...extra
        }));
    }

    function joinWith(parts, sep) {
        const out = [];
        parts.forEach((p, i) => {
            if (i) out.push({ text: sep, color: '#888' });
            out.push(...rich(p));
        });
        return out;
    }

    // ---------- building blocks ----------
    function section(title, fs) {
        return {
            stack: [
                { text: smallCaps(title, fs * 1.35, { color: accent, bold: true }) },
                { canvas: [{ type: 'line', x1: 0, y1: 1.5, x2: CONTENT_WIDTH, y2: 1.5, lineWidth: 0.8, lineColor: accent }] }
            ],
            margin: [0, fs * 1.1, 0, fs * 0.5],
            headlineLevel: 1
        };
    }

    function twoCol(left, right, style = {}) {
        return {
            columns: [
                { text: left, width: '*', ...style },
                { text: right, width: 'auto', alignment: 'right', noWrap: true, ...style }
            ],
            columnGap: 10
        };
    }

    function bullet(marker, content, fs) {
        return {
            columns: [
                { text: marker, width: fs * 1.1, color: accent },
                { text: content, width: '*' }
            ],
            columnGap: 0,
            margin: [fs * 0.4, fs * 0.18, 0, 0]
        };
    }

    let siteUrl = '';
    const absUrl = u => /^https?:/i.test(u) ? u : siteUrl.replace(/\/$/, '') + '/' + u.replace(/^\.?\//, '');

    // Sections with a "source" pull their items from another data file.
    async function loadSources(cv) {
        await Promise.all((cv.sections || []).filter(s => s.source).map(async s => {
            const res = await fetch('./assets/data/' + s.source, { cache: 'no-cache' });
            if (res.ok) s.items = await res.json();
        }));
    }

    // ---------- document ----------
    function buildDoc(cv, fs) {
        const h = cv.header;
        const content = [];
        const entryGap = fs * 0.75;
        const muted = '#444';

        content.push(
            { text: smallCaps(h.name, fs * 2.7, { color: accent }), alignment: 'center', lineHeight: 1 },
            { text: h.title, alignment: 'center', fontSize: fs * 1.25, margin: [0, fs * 0.15, 0, fs * 0.5], color: muted, preserveLeadingSpaces: true },
            { text: joinWith(h.contactLine, '   |   '), alignment: 'center', preserveLeadingSpaces: true },
            { text: joinWith(h.linksLine, '   |   '), alignment: 'center', margin: [0, fs * 0.2, 0, 0], preserveLeadingSpaces: true }
        );

        const shown = arr => (arr || []).filter(x => x && x.visible !== false);
        const bullets = list => shown(list).map(b => bullet('•', rich(b), fs));

        const renderers = {
            text: s => [{ text: rich(s.text), alignment: 'justify', lineHeight: 1.3 }],

            list: s => shown(s.items).map(i => ({ text: rich(i) })),

            skills: s => [{
                table: {
                    widths: [fs * 10, '*'],
                    body: shown(s.items).map(it => [
                        { text: it.label, bold: true },
                        { text: rich(it.value) }
                    ])
                },
                layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 6, paddingTop: () => fs * 0.15, paddingBottom: () => fs * 0.15 }
            }],

            // Company header, then one block per position (role + dates, bullets).
            // Each position is unbreakable; the company header sticks to the first one.
            experience: s => shown(s.items).map((e, i) => {
                const positions = shown(e.positions || [e]);
                const blocks = positions.map((p, j) => ({
                    stack: [
                        ...(j === 0 ? [twoCol(rich(e.company, { bold: true, fontSize: fs * 1.1 }), [{ text: e.location || '', italics: true, color: muted }])] : []),
                        twoCol(rich(p.role, { bold: true, color: muted }), [{ text: p.dates, bold: true }]),
                        ...bullets(p.bullets)
                    ],
                    margin: [0, j ? fs * 0.45 : 0, 0, 0],
                    unbreakable: true
                }));
                return { stack: blocks, margin: [0, i ? entryGap : 0, 0, 0] };
            }),

            projects: s => shown(s.items).map((p, i) => {
                const titleRuns = [{ text: p.name, bold: true, fontSize: fs * 1.1 }];
                if (p.tech) titleRuns.push({ text: '   ' + p.tech, color: muted });
                const sub = [];
                if (p.context) sub.push({ text: p.context, italics: true, color: muted });
                if (p.award) sub.push({ text: (p.context ? '  ·  ' : '') + p.award, italics: true, bold: true, color: accent });
                const link = p.link ? rich(p.link, { fontSize: fs * 0.92 }) : '';
                return {
                    stack: [
                        twoCol(titleRuns, [{ text: p.date || '', bold: true }], { preserveLeadingSpaces: true }),
                        twoCol(sub.length ? sub : '', link, { preserveLeadingSpaces: true }),
                        ...bullets(p.bullets)
                    ],
                    margin: [0, i ? entryGap : 0, 0, 0],
                    unbreakable: true
                };
            }),

            // Default: one compact paragraph of names (each linked to its letter).
            // Set "style": "quotes" on the section to show a quote per person instead.
            recommendations: s => s.style === 'quotes' ? renderQuotes(s) : [{
                text: [
                    ...shown(s.items).flatMap((r, i) => [
                        ...(i ? [{ text: '   ·   ', color: muted }] : []),
                        { text: r.name.replace(/ /g, ' '), bold: true, ...(r.letter ? { link: absUrl(r.letter), color: accent } : {}) },
                        { text: ' (' + r.title + ')', color: muted }
                    ]),
                    ...(s.note ? [{ text: '\n' }, ...rich(s.note, { fontSize: fs * 0.92 })] : [])
                ],
                lineHeight: 1.35,
                preserveLeadingSpaces: true
            }],

            education: s => shown(s.items).map((ed, i) => ({
                stack: [
                    twoCol(rich(ed.school, { bold: true, fontSize: fs * 1.1 }), [{ text: ed.dates, bold: true }]),
                    twoCol(rich(ed.degree, { italics: true, color: muted }), [{ text: ed.location, italics: true, color: muted }])
                ],
                margin: [0, i ? entryGap * 0.8 : 0, 0, 0],
                unbreakable: true
            }))
        };

        function renderQuotes(s) {
            return shown(s.items).map((r, i) => ({
                stack: [
                    { text: '“' + (r.cvQuote || r.quote) + '”', italics: true },
                    twoCol(
                        [{ text: '— ' + r.name, bold: true }, { text: ', ' + r.title, color: muted }],
                        r.letter ? [{ text: 'Full letter', link: absUrl(r.letter), color: accent, fontSize: fs * 0.92 }] : ''
                    )
                ],
                margin: [0, i ? entryGap * 0.8 : 0, 0, 0],
                unbreakable: true
            }));
        }

        shown(cv.sections).forEach(s => {
            const render = renderers[s.type];
            if (!render) { console.warn('Unknown CV section type:', s.type); return; }
            content.push(section(s.heading, fs), ...render(s));
        });

        if (cv.footer) {
            content.push({ text: cv.footer, alignment: 'center', fontSize: fs * 0.75, color: '#666', margin: [0, fs * 2, 0, 0] });
        }

        return {
            pageSize: 'A4',
            pageMargins: PAGE_MARGINS,
            info: { title: cv.meta.title, author: cv.meta.author, subject: 'Curriculum Vitae' },
            defaultStyle: { font: 'Roboto', fontSize: fs, lineHeight: 1.18, color: '#111' },
            content,
            // Keep a section heading together with the first entry under it.
            pageBreakBefore: (node, following) =>
                node.headlineLevel === 1 && following.length === 0,
            footer: (current, total) => {
                pageCount = total;
                if (total < 2) return null;
                return {
                    text: `${cv.header.name}  ·  ${current} / ${total}`,
                    alignment: 'center', fontSize: 7.5, color: '#999', margin: [0, 14, 0, 0]
                };
            }
        };
    }

    // Generate, shrinking the font only if it overflows maxPages.
    function generate(cv) {
        const maxPages = cv.meta.maxPages || 2;
        const startSize = cv.meta.fontSize || 10.5;
        return new Promise(resolve => {
            let first = null;
            const tryAt = fs => {
                const pdf = pdfMake.createPdf(buildDoc(cv, fs));
                pdf.getBlob(blob => {
                    const result = { pdf, blob, fs, pages: pageCount };
                    if (!first) first = result;
                    if (pageCount <= maxPages) return resolve(result);
                    if (fs - 0.25 >= MIN_FONT_SIZE) return tryAt(fs - 0.25);
                    // Can't fit even at the minimum size: keep the readable version.
                    console.warn(`CV needs more than ${maxPages} pages; trim content in cv.json.`);
                    resolve(first);
                });
            };
            tryAt(startSize);
        });
    }

    // ---------- mobile preview (pdf.js) ----------
    const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(s);
        });
    }

    async function renderPages(blob, container) {
        if (!window.pdfjsLib) await loadScript(PDFJS + 'pdf.min.js');
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
        const doc = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
        const dpr = Math.min(window.devicePixelRatio || 1, 3);

        container.innerHTML = '';
        container.classList.remove('hidden');
        const cs = getComputedStyle(container);
        const width = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);

        for (let n = 1; n <= doc.numPages; n++) {
            const page = await doc.getPage(n);
            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: width / base.width });

            const wrap = document.createElement('div');
            wrap.className = 'page';
            wrap.style.width = viewport.width + 'px';
            wrap.style.height = viewport.height + 'px';

            const canvas = document.createElement('canvas');
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = viewport.width + 'px';
            canvas.style.height = viewport.height + 'px';
            wrap.appendChild(canvas);
            container.appendChild(wrap);

            await page.render({
                canvasContext: canvas.getContext('2d'),
                viewport,
                transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null
            }).promise;

            // Keep links tappable: overlay an <a> on each link annotation.
            const annotations = await page.getAnnotations();
            annotations.filter(a => a.subtype === 'Link' && a.url).forEach(a => {
                const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(a.rect);
                const link = document.createElement('a');
                link.href = a.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.cssText = `left:${Math.min(x1, x2)}px;top:${Math.min(y1, y2)}px;width:${Math.abs(x2 - x1)}px;height:${Math.abs(y2 - y1)}px`;
                wrap.appendChild(link);
            });
        }
    }

    async function init() {
        const status = document.getElementById('status');
        try {
            const res = await fetch('./assets/data/cv.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error('cv.json: HTTP ' + res.status);
            const cv = await res.json();
            if (cv.meta.accentColor) accent = cv.meta.accentColor;
            siteUrl = cv.meta.siteUrl || location.origin;
            await loadSources(cv);
            const { pdf, blob, fs, pages } = await generate(cv);
            window.__cvResult = { fontSize: fs, pages };

            const fileName = cv.meta.fileName || 'CV.pdf';
            const dl = document.getElementById('download-btn');
            dl.disabled = false;
            // Save the exact bytes already shown in the preview. Calling pdf.download()
            // would re-render from a doc definition pdfmake already mutated, which
            // breaks the layout (big gaps, extra pages).
            const blobUrl = URL.createObjectURL(blob);
            dl.onclick = () => {
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
            };

            // Mobile browsers can't show a PDF inside an iframe (Android shows nothing,
            // iOS only page 1), so on phones/tablets the pages are drawn with pdf.js.
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
                (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
            if (isMobile) {
                const open = document.getElementById('open-btn');
                open.classList.remove('hidden');
                open.onclick = () => window.open(blobUrl, '_blank');
                status.textContent = 'Loading preview...';
                try {
                    await renderPages(blob, document.getElementById('pages'));
                    status.classList.add('hidden');
                } catch (e) {
                    console.error(e);
                    status.textContent = 'Your CV is ready. Use the buttons above to open or download it.';
                }
            } else {
                const viewer = document.getElementById('viewer');
                viewer.src = URL.createObjectURL(blob);
                viewer.classList.remove('hidden');
                status.classList.add('hidden');
            }
        } catch (err) {
            console.error(err);
            status.innerHTML = 'Could not generate the CV. <a style="color:#ffd700" href="./assets/pdf/KenanEGE_CV.pdf">Open the static PDF instead</a>.';
        }
    }

    init();
})();
