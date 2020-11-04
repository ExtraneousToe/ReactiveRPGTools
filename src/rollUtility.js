(Renderer.dice = {
    SYSTEM_USER: { name: "Avandra" },
    POS_INFINITE: 1e20,
    _$wrpRoll: null,
    _$minRoll: null,
    _$iptRoll: null,
    _$outRoll: null,
    _$head: null,
    _hist: [],
    _histIndex: null,
    _$lastRolledBy: null,
    _storage: null,
    _isManualMode: !1,
    DICE: [4, 6, 8, 10, 12, 20, 100],
    getNextDice(a) {
        const b = Renderer.dice.DICE.indexOf(a);
        return ~b ? Renderer.dice.DICE[b + 1] : null;
    },
    getPreviousDice(a) {
        const b = Renderer.dice.DICE.indexOf(a);
        return ~b ? Renderer.dice.DICE[b - 1] : null;
    },
    _panel: null,
    bindDmScreenPanel(a, b) {
        Renderer.dice._panel && Renderer.dice.unbindDmScreenPanel(),
            Renderer.dice._showBox(),
            (Renderer.dice._panel = a),
            a.doPopulate_Rollbox(b);
    },
    unbindDmScreenPanel() {
        Renderer.dice._panel &&
            ($(`body`).append(Renderer.dice._$wrpRoll),
            Renderer.dice._panel.close$TabContent(),
            (Renderer.dice._panel = null),
            Renderer.dice._hideBox(),
            Renderer.dice._$wrpRoll.removeClass("rollbox-panel"));
    },
    get$Roller() {
        return Renderer.dice._$wrpRoll;
    },
    parseRandomise2(a) {
        if (!a || !a.trim()) return null;
        const b = Renderer.dice.lang.getTree3(a);
        return b ? b.evl({}) : null;
    },
    parseAverage(a) {
        if (!a || !a.trim()) return null;
        const b = Renderer.dice.lang.getTree3(a);
        return b ? b.avg({}) : null;
    },
    _showBox() {
        "flex" !== Renderer.dice._$wrpRoll.css("display") &&
            (Renderer.dice._$minRoll.hide(),
            Renderer.dice._$wrpRoll.css("display", "flex"),
            Renderer.dice._$iptRoll.prop(
                "placeholder",
                `${Renderer.dice._getRandomPlaceholder()} or "/help"`
            ));
    },
    _hideBox() {
        Renderer.dice._$minRoll.show(),
            Renderer.dice._$wrpRoll.css("display", "");
    },
    _getRandomPlaceholder() {
        const a = RollerUtil.randomise(10),
            b =
                Renderer.dice.DICE[
                    RollerUtil.randomise(Renderer.dice.DICE.length - 1)
                ],
            c = (RollerUtil.randomise(3) - 2) * RollerUtil.randomise(10),
            d = 1 < a && 5 === RollerUtil.randomise(5),
            e = d ? (2 === RollerUtil.randomise(2) ? "h" : "l") : "",
            f = d ? RollerUtil.randomise(a - 1) : null;
        return `${a}d${b}${d ? `d${e}${f}` : ""}${
            0 > c ? c : 0 < c ? `+${c}` : ""
        }`;
    },
    async _pInit() {
        const a = $(`<div class="rollbox"></div>`),
            b = $(
                `<div class="rollbox-min"><span class="glyphicon glyphicon-chevron-up"></span></div>`
            ).on("click", () => {
                Renderer.dice._showBox(), Renderer.dice._$iptRoll.focus();
            }),
            c = $(
                `<div class="head-roll"><span class="hdr-roll">Dice Roller</span><span class="delete-icon glyphicon glyphicon-remove"></span></div>`
            ).on("click", () => {
                Renderer.dice._panel || Renderer.dice._hideBox();
            }),
            d = $(`<div class="out-roll">`),
            f = $(
                `<input class="ipt-roll form-control" autocomplete="off" spellcheck="false">`
            )
                .on("keypress", async (a) => {
                    13 === a.which &&
                        (await Renderer.dice.pRoll2(f.val(), {
                            isUser: !0,
                            name: "Anon",
                        }),
                        f.val("")),
                        a.stopPropagation();
                })
                .on("keydown", (a) => {
                    38 === a.which
                        ? Renderer.dice._prevHistory()
                        : 40 === a.which && Renderer.dice._nextHistory();
                });
        a.append(c).append(d).append(f),
            (Renderer.dice._$wrpRoll = a),
            (Renderer.dice._$minRoll = b),
            (Renderer.dice._$head = c),
            (Renderer.dice._$outRoll = d),
            (Renderer.dice._$iptRoll = f),
            $(`body`).append(b).append(a),
            a.on("click", ".out-roll-item-code", (a) =>
                Renderer.dice._$iptRoll.val($(a.target).text()).focus()
            ),
            (Renderer.dice.storage =
                (await StorageUtil.pGet(VeCt.STORAGE_ROLLER_MACRO)) || {});
    },
    _prevHistory: () => {
        Renderer.dice._histIndex--,
            Renderer.dice._cleanHistoryIndex(),
            Renderer.dice._$iptRoll.val(
                Renderer.dice._hist[Renderer.dice._histIndex]
            );
    },
    _nextHistory: () => {
        Renderer.dice._histIndex++,
            Renderer.dice._cleanHistoryIndex(),
            Renderer.dice._$iptRoll.val(
                Renderer.dice._hist[Renderer.dice._histIndex]
            );
    },
    _cleanHistoryIndex: () => {
        var a = Math.min,
            b = Math.max;
        Renderer.dice._histIndex = Renderer.dice._hist.length
            ? a(Renderer.dice._hist.length, b(Renderer.dice._histIndex, 0))
            : null;
    },
    _addHistory: (a) => {
        Renderer.dice._hist.push(a),
            (Renderer.dice._histIndex = Renderer.dice._hist.length);
    },
    _scrollBottom: () => {
        Renderer.dice._$outRoll.scrollTop(1e10);
    },
    async pRollerClickUseData(a, b) {
        const c = $(b),
            d = c.data("packed-dice");
        let e = c.data("roll-name"),
            f = a.shiftKey,
            g = a.ctrlKey || a.metaKey;
        const h = d.toRoll
            .split(";")
            .map((a) => a.trim())
            .filter(Boolean);
        let i;
        if (1 < h.length) {
            const b = MiscUtil.copy(d),
                c = ContextUtil.getMenu([
                    new ContextUtil.Action("Choose Roll", null, {
                        isDisabled: !0,
                    }),
                    null,
                    ...h.map(
                        (a) =>
                            new ContextUtil.Action(
                                `Roll ${a}`,
                                (c) => (
                                    (f = f || c.shiftKey),
                                    (g = g || c.ctrlKey || c.metaKey),
                                    (b.toRoll = a),
                                    b
                                )
                            )
                    ),
                ]);
            i = await ContextUtil.pOpenMenu(a, c);
        } else i = d;
        if (!i) return;
        const j = /#\$prompt_number:?([^$]*)\$#/g,
            k = [];
        for (let c; (c = j.exec(i.toRoll)); ) {
            const a = c[1],
                b = {};
            if (a) {
                const c = a.split(",");
                c.map((a) => a.trim()).forEach((a) => {
                    const [c, d] = a.split("=").map((a) => a.trim());
                    switch (c) {
                        case "min":
                        case "max":
                            b[c] = +d;
                            break;
                        default:
                            b[c] = d;
                    }
                });
            }
            null == b.min && (b.min = 0),
                null == b.max && (b.max = Renderer.dice.POS_INFINITE),
                null == b.default && (b.default = 0);
            const d = await InputUiUtil.pGetUserNumber(b);
            if (null == d) return;
            k.push(d);
        }
        const l = MiscUtil.copy(i);
        (j.lastIndex = 0), (l.toRoll = l.toRoll.replace(j, () => k.shift()));
        let m;
        if (d.prompt) {
            const b = Object.keys(l.prompt.options).sort(SortUtil.ascSortLower),
                c = ContextUtil.getMenu([
                    new ContextUtil.Action(l.prompt.entry, null, {
                        isDisabled: !0,
                    }),
                    null,
                    ...b.map((a) => {
                        const b =
                            "psi" === l.prompt.mode
                                ? `${a} point${"1" === a ? "" : "s"}`
                                : `${Parser.spLevelToFull(a)} level`;
                        return new ContextUtil.Action(b, (b) => {
                            (f = f || b.shiftKey),
                                (g = g || b.ctrlKey || b.metaKey);
                            const c = l.prompt.options[a];
                            return c
                                ? ((e =
                                      "psi" === l.prompt.mode
                                          ? `${a} psi activation`
                                          : `${Parser.spLevelToFull(
                                                a
                                            )}-level cast`),
                                  (l.toRoll += `+${c}`),
                                  l)
                                : ((e = ""), l);
                        });
                    }),
                ]);
            m = await ContextUtil.pOpenMenu(a, c);
        } else m = l;
        m &&
            (await Renderer.dice.pRollerClick(
                { shiftKey: f, ctrlKey: g },
                b,
                JSON.stringify(m),
                e
            ));
    },
    __rerollNextInlineResult(a) {
        const b = $(a),
            c = b.next(`.result`),
            d = Renderer.dice.__rollPackedData(b);
        c.text(d);
    },
    __rollPackedData(a) {
        const b = Renderer.dice.lang.getTree3(a.data("packed-dice").toRoll);
        return b.evl({});
    },
    _pRollerClick_getMsgBug(a) {
        return `<span class="message">No result found matching roll ${a}?! <span class="help--subtle" title="Bug!">🐛</span></span>`;
    },
    async pRollerClick(a, b, c, d) {
        function e(a) {
            const b = j.closest(`table`),
                c = b.find(`td`).filter((c, d) => {
                    const e = $(d);
                    return (
                        !!e.closest(`table`).is(b) &&
                        a >= +e.data("roll-min") &&
                        a <= +e.data("roll-max")
                    );
                });
            return c.length && c.nextAll().length ? c.nextAll().get() : null;
        }
        function f(a) {
            a.find(`.render-roller`).each((a, b) => {
                const c = $(b),
                    d = Renderer.dice.__rollPackedData(c);
                c.attr(
                    "onclick",
                    `Renderer.dice.__rerollNextInlineResult(this)`
                ),
                    c.after(` (<span class="result">${d}</span>)`);
            });
        }
        function g(a) {
            const b = e(a);
            if (b) {
                const a = b
                        .map((a) => a.innerHTML.trim())
                        .filter((a) => a)
                        .join(" | "),
                    c = $(`<span class="message">${a}</span>`);
                return f(j), c.html();
            }
            return Renderer.dice._pRollerClick_getMsgBug(a);
        }
        function h(a, b) {
            const c = e(b);
            if (c) {
                const b = $(
                    `<span class="message">${c[a].innerHTML.trim()}</span>`
                );
                return f(j), b.html();
            }
            return Renderer.dice._pRollerClick_getMsgBug(b);
        }
        async function i() {
            Renderer.dice.addElement(l, `<i>${l.label}:</i>`);
            const a = [],
                b = +n.attr("data-rd-namegeneratorrolls"),
                c = j.closest(`table`).find(`th`);
            for (let d = 0; d < b; ++d) {
                const b = MiscUtil.copy(l);
                b.label = $(c.get(d + 1))
                    .text()
                    .trim();
                const f = await Renderer.dice.pRollEntry(m.entry, b, {
                        fnGetMessage: h.bind(null, d),
                        rollCount: m.rollCount,
                    }),
                    g = e(f);
                if (!g) {
                    a.push(`(no result)`);
                    continue;
                }
                a.push(g[d].innerHTML.trim());
            }
            Renderer.dice.addElement(l, `= ${a.join(" ")}`);
        }
        const j = $(b),
            k = JSON.parse(c),
            l = {
                name: (function () {
                    const a = j.closest(`.hwin`);
                    if (a.length) return a.find(`.stats-name`).first().text();
                    const b = j.closest(`.out-roll-wrp`);
                    if (b.length) return b.data("name");
                    const c = j
                        .closest(`.dm-screen-panel`)
                        .children(`.panel-control-title`);
                    if (c.length) return c.text().trim();
                    let d = document.title.replace("- 5etools", "").trim();
                    return "DM Screen" === d ? "Dungeon Master" : d;
                })(),
                label:
                    null == d
                        ? (function () {
                              let a = $(b)
                                  .closest(`table:not(.stats)`)
                                  .children(`caption`)
                                  .text();
                              return a
                                  ? a.trim()
                                  : ((a = $(b)
                                        .parent()
                                        .children(`.list-item-title`)
                                        .text()),
                                    a)
                                  ? a.trim()
                                  : ((a = $(b)
                                        .closest(`div`)
                                        .children(`.rd__h`)
                                        .first()
                                        .find(`.entry-title-inner`)
                                        .text()),
                                    a)
                                  ? ((a = a.trim().replace(/[.,:]\s*$/, "")), a)
                                  : ((a = $(b)
                                        .closest(`table.stats`)
                                        .children(`tbody`)
                                        .first()
                                        .children(`tr`)
                                        .first()
                                        .find(`.rnd-name .stats-name`)
                                        .text()),
                                    a
                                        ? a.trim()
                                        : UrlUtil.getCurrentPage() ===
                                              UrlUtil.PG_CHARACTERS &&
                                          ((a = (
                                              $(b)
                                                  .closest(`.chr-entity__row`)
                                                  .find(".chr-entity__ipt-name")
                                                  .val() || ""
                                          ).trim()),
                                          a)
                                        ? a
                                        : a);
                          })(b)
                        : d,
            },
            m = Renderer.dice.getEventModifiedRollMeta(a, k);
        let n = j.parent();
        for (; n.length && !(n.is("th") || n.is("p") || n.is("table")); )
            n = n.parent();
        if (n.is("th")) {
            const a = "true" === n.attr("data-rd-isroller");
            a && n.attr("data-rd-namegeneratorrolls")
                ? i()
                : Renderer.dice.pRollEntry(m.entry, l, {
                      fnGetMessage: g,
                      rollCount: m.rollCount,
                  });
        } else Renderer.dice.pRollEntry(m.entry, l, { rollCount: m.rollCount });
    },
    getEventModifiedRollMeta(a, b) {
        const c = { rollCount: 1, entry: b };
        if (a.shiftKey)
            if ("damage" === b.subType) {
                const a = [];
                b.toRoll
                    .replace(/\s+/g, "")
                    .replace(/\d*?d\d+/gi, (b) => a.push(b)),
                    (b.toRoll = `${b.toRoll}${
                        a.length ? `+${a.join("+")}` : ""
                    }`);
            } else
                "d20" === b.subType
                    ? (b.toRoll =
                          null == b.d20mod
                              ? b.toRoll.replace(/^\s*1?\s*d\s*20/, "2d20dl1")
                              : `2d20dl1${b.d20mod}`)
                    : (c.rollCount = 2);
        return (
            (a.ctrlKey || a.metaKey) &&
                ("damage" === b.subType
                    ? (b.toRoll = `floor((${b.toRoll}) / 2)`)
                    : "d20" === b.subType
                    ? null == b.d20mod
                        ? (b.toRoll = b.toRoll.replace(
                              /^\s*1?\s*d\s*20/,
                              "2d20dh1"
                          ))
                        : (b.toRoll = `2d20dh1${b.d20mod}`)
                    : (c.rollCount = 2)),
            c
        );
    },
    async pRoll2(a, b, c) {
        if (((c = c || {}), (a = a.trim()), !!a))
            if ((b.isUser && Renderer.dice._addHistory(a), a.startsWith("/")))
                Renderer.dice._handleCommand(a, b);
            else if (a.startsWith("#"))
                return Renderer.dice._pHandleSavedRoll(a, b, c);
            else {
                const [d, ...e] = a.split(":");
                e.length && ((a = e.join(":")), (b.label = d));
                const f = Renderer.dice.lang.getTree3(a);
                return Renderer.dice._pHandleRoll2(f, b, c);
            }
    },
    async pRollEntry(a, b, c) {
        var d = Math.round,
            e = Math.max;
        c = c || {};
        const f = d(c.rollCount || 1);
        if ((delete c.rollCount, 0 >= f))
            throw new Error(
                `Invalid roll count: ${f} (must be a positive integer)`
            );
        const g = Renderer.dice.lang.getTree3(a.toRoll);
        (g.successThresh = a.successThresh), (g.successMax = a.successMax);
        const h = [];
        1 < f && Renderer.dice._showMessage(`Rolling twice...`, b);
        for (let d = 0; d < f; ++d) {
            const a = await Renderer.dice._pHandleRoll2(g, b, c);
            if (null == a) return null;
            h.push(a);
        }
        return e(...h);
    },
    _pHandleRoll2(a, b, c) {
        return (
            (c = c || {}),
            Renderer.dice._isManualMode
                ? Renderer.dice._pHandleRoll2_manual(a, b, c)
                : Renderer.dice._pHandleRoll2_automatic(a, b, c)
        );
    },
    _pHandleRoll2_automatic(a, b, c) {
        (c = c || {}),
            Renderer.dice._showBox(),
            Renderer.dice._checkHandleName(b.name);
        const d = Renderer.dice._$lastRolledBy;
        if (a) {
            const e = {},
                f = a.evl(e),
                g = (e.html || []).join(""),
                h =
                    e.allMax &&
                    e.allMax.length &&
                    !e.allMax.filter((a) => !a).length,
                i =
                    e.allMin &&
                    e.allMin.length &&
                    !e.allMin.filter((a) => !a).length,
                j =
                    b.label &&
                    (!b.name ||
                        b.label.trim().toLowerCase() !==
                            b.name.trim().toLowerCase())
                        ? b.label
                        : null,
                k = a.successThresh
                    ? `<span class="roll">${
                          f > (a.successMax || 100) - a.successThresh
                              ? "Success!"
                              : "Failure"
                      }</span>`
                    : `<span class="roll ${
                          h ? "roll-max" : i ? "roll-min" : ""
                      }">${f}</span>`,
                l = `${b.name ? `${b.name} \u2014 ` : ""}${
                    j ? `${j}: ` : ""
                }${a}`;
            return (
                d.append(`
				<div class="out-roll-item" title="${l}">
					<div>
						${j ? `<span class="roll-label">${j}: </span>` : ""}
						${k}
						<span class="all-rolls ve-muted">${g}</span>
						${c.fnGetMessage ? `<span class="message">${c.fnGetMessage(f)}</span>` : ""}
					</div>
					<div class="out-roll-item-button-wrp">
						<button title="Copy to input" class="btn btn-default btn-xs btn-copy-roll" onclick="Renderer.dice._$iptRoll.val('${a
                            .toString()
                            .replace(
                                /\s+/g,
                                ""
                            )}'); Renderer.dice._$iptRoll.focus()"><span class="glyphicon glyphicon-pencil"></span></button>
					</div>
				</div>`),
                ExtensionUtil.doSendRoll({
                    dice: a.toString(),
                    rolledBy: b.name,
                    label: j,
                }),
                Renderer.dice._scrollBottom(),
                f
            );
        }
        return (
            d.append(
                `<div class="out-roll-item">Invalid input! Try &quot;/help&quot;</div>`
            ),
            Renderer.dice._scrollBottom(),
            null
        );
    },
    _pHandleRoll2_manual(a, b, c) {
        if (((c = c || {}), !a))
            return JqueryUtil.doToast({
                type: "danger",
                content: `Invalid roll input!`,
            });
        const d = (b.label || "").toTitleCase() || "Roll Dice",
            e = $(
                `<div class="p-2 bold flex-vh-center rll__prompt-header">${a.toString()}</div>`
            );
        if (c.isResultUsed)
            return InputUiUtil.pGetUserNumber({ title: d, $elePre: e });
        else {
            const { $modalInner: a } = UiUtil.getShowModal({
                title: d,
                isMinHeight0: !0,
            });
            return e.appendTo(a), null;
        }
    },
    _showMessage(a, b) {
        Renderer.dice._showBox(), Renderer.dice._checkHandleName(b.name);
        const c = Renderer.dice._$lastRolledBy;
        c.append(
            `<div class="out-roll-item out-roll-item--message">${a}</div>`
        ),
            Renderer.dice._scrollBottom();
    },
    _validCommands: new Set(["/c", "/cls", "/clear"]),
    _handleCommand(a, b) {
        function c() {
            Renderer.dice._showMessage(
                "Invalid input! Try &quot;/help&quot;",
                Renderer.dice.SYSTEM_USER
            );
        }
        function d(a, b) {
            return a.length === b;
        }
        async function e() {
            await StorageUtil.pSet(
                VeCt.STORAGE_ROLLER_MACRO,
                Renderer.dice.storage
            );
        }
        Renderer.dice._showMessage(
            `<span class="out-roll-item-code">${a}</span>`,
            b
        );
        if ("/help" === a || "/h" === a)
            Renderer.dice._showMessage(
                `<ul class="rll__list">
					<li>Keep highest; <span class="out-roll-item-code">4d6kh3</span></li>
					<li>Drop lowest; <span class="out-roll-item-code">4d6dl1</span></li>
					<li>Drop highest; <span class="out-roll-item-code">3d4dh1</span></li>
					<li>Keep lowest; <span class="out-roll-item-code">3d4kl1</span></li>

					<li>Reroll equal; <span class="out-roll-item-code">2d4r1</span></li>
					<li>Reroll less; <span class="out-roll-item-code">2d4r&lt;2</span></li>
					<li>Reroll less or equal; <span class="out-roll-item-code">2d4r&lt;=2</span></li>
					<li>Reroll greater; <span class="out-roll-item-code">2d4r&gt;2</span></li>
					<li>Reroll greater equal; <span class="out-roll-item-code">2d4r&gt;=3</span></li>

					<li>Explode equal; <span class="out-roll-item-code">2d4x4</span></li>
					<li>Explode less; <span class="out-roll-item-code">2d4x&lt;2</span></li>
					<li>Explode less or equal; <span class="out-roll-item-code">2d4x&lt;=2</span></li>
					<li>Explode greater; <span class="out-roll-item-code">2d4x&gt;2</span></li>
					<li>Explode greater equal; <span class="out-roll-item-code">2d4x&gt;=3</span></li>

					<li>Count Successes equal; <span class="out-roll-item-code">2d4cs=4</span></li>
					<li>Count Successes less; <span class="out-roll-item-code">2d4cs&lt;2</span></li>
					<li>Count Successes less or equal; <span class="out-roll-item-code">2d4cs&lt;=2</span></li>
					<li>Count Successes greater; <span class="out-roll-item-code">2d4cs&gt;2</span></li>
					<li>Count Successes greater equal; <span class="out-roll-item-code">2d4cs&gt;=3</span></li>

					<li>Dice pools; <span class="out-roll-item-code">{2d8, 1d6}</span></li>
					<li>Dice pools with modifiers; <span class="out-roll-item-code">{1d20+7, 10}kh1</span></li>

					<li>Rounding; <span class="out-roll-item-code">floor(1.5)</span>, <span class="out-roll-item-code">ceil(1.5)</span>, <span class="out-roll-item-code">round(1.5)</span></li>

					<li>Average; <span class="out-roll-item-code">avg(8d6)</span></li>
				</ul>
				Up and down arrow keys cycle input history.<br>
				Anything before a colon is treated as a label (<span class="out-roll-item-code">Fireball: 8d6</span>)<br>
Use <span class="out-roll-item-code">${"/macro"} list</span> to list saved macros.<br>
				Use <span class="out-roll-item-code">${"/macro"} add myName 1d2+3</span> to add (or update) a macro. Macro names should not contain spaces or hashes.<br>
				Use <span class="out-roll-item-code">${"/macro"} remove myName</span> to remove a macro.<br>
				Use <span class="out-roll-item-code">#myName</span> to roll a macro.<br>
				Use <span class="out-roll-item-code">/clear</span> to clear the roller.`,
                Renderer.dice.SYSTEM_USER
            );
        else if (a.startsWith("/macro")) {
            const [b, f, ...g] = a.split(/\s+/);
            if (!["list", "add", "remove", "clear"].includes(f)) c();
            else
                switch (f) {
                    case "list":
                        d(g, 0)
                            ? Object.keys(Renderer.dice.storage).forEach(
                                  (a) => {
                                      Renderer.dice._showMessage(
                                          `<span class="out-roll-item-code">#${a}</span> \u2014 ${Renderer.dice.storage[a]}`,
                                          Renderer.dice.SYSTEM_USER
                                      );
                                  }
                              )
                            : c();
                        break;
                    case "add": {
                        if (d(g, 2)) {
                            const [a, b] = g;
                            a.includes(" ") || a.includes("#")
                                ? c()
                                : ((Renderer.dice.storage[a] = b),
                                  e().then(() =>
                                      Renderer.dice._showMessage(
                                          `Saved macro <span class="out-roll-item-code">#${a}</span>`,
                                          Renderer.dice.SYSTEM_USER
                                      )
                                  ));
                        } else c();
                        break;
                    }
                    case "remove":
                        d(g, 1)
                            ? Renderer.dice.storage[g[0]]
                                ? (delete Renderer.dice.storage[g[0]],
                                  e().then(() =>
                                      Renderer.dice._showMessage(
                                          `Removed macro <span class="out-roll-item-code">#${g[0]}</span>`,
                                          Renderer.dice.SYSTEM_USER
                                      )
                                  ))
                                : Renderer.dice._showMessage(
                                      `Macro <span class="out-roll-item-code">#${g[0]}</span> not found`,
                                      Renderer.dice.SYSTEM_USER
                                  )
                            : c();
                }
        } else
            Renderer.dice._validCommands.has(a)
                ? "/c" === a || "/cls" === a || "/clear" === a
                    ? (Renderer.dice._$outRoll.empty(),
                      Renderer.dice._$lastRolledBy.empty(),
                      (Renderer.dice._$lastRolledBy = null))
                    : void 0
                : c();
    },
    _pHandleSavedRoll(a, b, c) {
        a = a.replace(/^#/, "");
        const d = Renderer.dice.storage[a];
        if (d) {
            b.label = a;
            const e = Renderer.dice.lang.getTree3(d);
            return Renderer.dice._pHandleRoll2(e, b, c);
        }
        Renderer.dice._showMessage(
            `Macro <span class="out-roll-item-code">#${a}</span> not found`,
            Renderer.dice.SYSTEM_USER
        );
    },
    addRoll(a, b) {
        b.trim() &&
            (Renderer.dice._showBox(),
            Renderer.dice._checkHandleName(a.name),
            Renderer.dice._$outRoll.prepend(
                `<div class="out-roll-item" title="${a.name || ""}">${b}</div>`
            ),
            Renderer.dice._scrollBottom());
    },
    addElement(a, b) {
        Renderer.dice._showBox(),
            Renderer.dice._checkHandleName(a.name),
            $$`<div class="out-roll-item out-roll-item--message">${b}</div>`.appendTo(
                Renderer.dice._$lastRolledBy
            ),
            Renderer.dice._scrollBottom();
    },
    _checkHandleName(a) {
        (Renderer.dice._$lastRolledBy &&
            Renderer.dice._$lastRolledBy.data("name") === a) ||
            (Renderer.dice._$outRoll.prepend(
                `<div class="ve-muted out-roll-id">${a}</div>`
            ),
            (Renderer.dice._$lastRolledBy = $(
                `<div class="out-roll-wrp"></div>`
            ).data("name", a)),
            Renderer.dice._$outRoll.prepend(Renderer.dice._$lastRolledBy));
    },
}),
    (Renderer.dice.lang = {
        validate3(a) {
            a = a.trim();
            let b;
            try {
                b = Renderer.dice.lang._lex3(a);
            } catch (a) {
                return a.message;
            }
            try {
                Renderer.dice.lang._parse3(b);
            } catch (a) {
                return a.message;
            }
            return null;
        },
        getTree3(a, b = !0) {
            if (((a = a.trim()), b))
                try {
                    const b = Renderer.dice.lang._lex3(a);
                    return Renderer.dice.lang._parse3(b);
                } catch (a) {
                    return null;
                }
            else {
                const b = Renderer.dice.lang._lex3(a);
                return Renderer.dice.lang._parse3(b);
            }
        },
        _M_NUMBER_CHAR: /[0-9.]/,
        _M_SYMBOL_CHAR: /[-+/*^=><florceidhkxunavgs,]/,
        _M_NUMBER: /^[\d.,]+$/,
        _lex3(a) {
            const b = {
                tokenStack: [],
                parenCount: 0,
                braceCount: 0,
                mode: null,
                token: "",
            };
            return ((a = a
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[×]/g, "*")
                .replace(/\*\*/g, "^")
                .replace(/÷/g, "/")
                .replace(/--/g, "+")
                .replace(/\+-|-\+/g, "-")),
            !a)
                ? []
                : (this._lex3_lex(b, a), b.tokenStack);
        },
        _lex3_lex(a, b) {
            const c = b.length;
            for (let d = 0; d < c; ++d) {
                const e = b[d];
                switch (e) {
                    case "(":
                        a.parenCount++,
                            this._lex3_outputToken(a),
                            (a.token = "("),
                            this._lex3_outputToken(a);
                        break;
                    case ")":
                        if ((a.parenCount--, 0 > a.parenCount))
                            throw new Error(
                                `Syntax error: closing <code>)</code> without opening <code>(</code>`
                            );
                        this._lex3_outputToken(a),
                            (a.token = ")"),
                            this._lex3_outputToken(a);
                        break;
                    case "{":
                        a.braceCount++,
                            this._lex3_outputToken(a),
                            (a.token = "{"),
                            this._lex3_outputToken(a);
                        break;
                    case "}":
                        if ((a.braceCount--, 0 > a.parenCount))
                            throw new Error(
                                `Syntax error: closing <code>}</code> without opening <code>(</code>`
                            );
                        this._lex3_outputToken(a),
                            (a.token = "}"),
                            this._lex3_outputToken(a);
                        break;
                    case "+":
                    case "-":
                    case "*":
                    case "/":
                    case "^":
                    case ",":
                        this._lex3_outputToken(a),
                            (a.token += e),
                            this._lex3_outputToken(a);
                        break;
                    default: {
                        if (Renderer.dice.lang._M_NUMBER_CHAR.test(e))
                            "symbol" === a.mode && this._lex3_outputToken(a),
                                (a.token += e),
                                (a.mode = "text");
                        else if (Renderer.dice.lang._M_SYMBOL_CHAR.test(e))
                            "text" === a.mode && this._lex3_outputToken(a),
                                (a.token += e),
                                (a.mode = "symbol");
                        else
                            throw new Error(
                                `Syntax error: unexpected character <code>${e}</code>`
                            );
                        break;
                    }
                }
            }
            this._lex3_outputToken(a);
        },
        _lex3_outputToken(a) {
            if (a.token) {
                switch (a.token) {
                    case "(":
                        a.tokenStack.push(Renderer.dice.tk.PAREN_OPEN);
                        break;
                    case ")":
                        a.tokenStack.push(Renderer.dice.tk.PAREN_CLOSE);
                        break;
                    case "{":
                        a.tokenStack.push(Renderer.dice.tk.BRACE_OPEN);
                        break;
                    case "}":
                        a.tokenStack.push(Renderer.dice.tk.BRACE_CLOSE);
                        break;
                    case ",":
                        a.tokenStack.push(Renderer.dice.tk.COMMA);
                        break;
                    case "+":
                        a.tokenStack.push(Renderer.dice.tk.ADD);
                        break;
                    case "-":
                        a.tokenStack.push(Renderer.dice.tk.SUB);
                        break;
                    case "*":
                        a.tokenStack.push(Renderer.dice.tk.MULT);
                        break;
                    case "/":
                        a.tokenStack.push(Renderer.dice.tk.DIV);
                        break;
                    case "^":
                        a.tokenStack.push(Renderer.dice.tk.POW);
                        break;
                    case "floor":
                        a.tokenStack.push(Renderer.dice.tk.FLOOR);
                        break;
                    case "ceil":
                        a.tokenStack.push(Renderer.dice.tk.CEIL);
                        break;
                    case "round":
                        a.tokenStack.push(Renderer.dice.tk.ROUND);
                        break;
                    case "avg":
                        a.tokenStack.push(Renderer.dice.tk.AVERAGE);
                        break;
                    case "d":
                        a.tokenStack.push(Renderer.dice.tk.DICE);
                        break;
                    case "dh":
                        a.tokenStack.push(Renderer.dice.tk.DROP_HIGHEST);
                        break;
                    case "kh":
                        a.tokenStack.push(Renderer.dice.tk.KEEP_HIGHEST);
                        break;
                    case "dl":
                        a.tokenStack.push(Renderer.dice.tk.DROP_LOWEST);
                        break;
                    case "kl":
                        a.tokenStack.push(Renderer.dice.tk.KEEP_LOWEST);
                        break;
                    case "r":
                        a.tokenStack.push(Renderer.dice.tk.REROLL_EXACT);
                        break;
                    case "r>":
                        a.tokenStack.push(Renderer.dice.tk.REROLL_GT);
                        break;
                    case "r>=":
                        a.tokenStack.push(Renderer.dice.tk.REROLL_GTEQ);
                        break;
                    case "r<":
                        a.tokenStack.push(Renderer.dice.tk.REROLL_LT);
                        break;
                    case "r<=":
                        a.tokenStack.push(Renderer.dice.tk.REROLL_LTEQ);
                        break;
                    case "x":
                        a.tokenStack.push(Renderer.dice.tk.EXPLODE_EXACT);
                        break;
                    case "x>":
                        a.tokenStack.push(Renderer.dice.tk.EXPLODE_GT);
                        break;
                    case "x>=":
                        a.tokenStack.push(Renderer.dice.tk.EXPLODE_GTEQ);
                        break;
                    case "x<":
                        a.tokenStack.push(Renderer.dice.tk.EXPLODE_LT);
                        break;
                    case "x<=":
                        a.tokenStack.push(Renderer.dice.tk.EXPLODE_LTEQ);
                        break;
                    case "cs=":
                        a.tokenStack.push(Renderer.dice.tk.COUNT_SUCCESS_EXACT);
                        break;
                    case "cs>":
                        a.tokenStack.push(Renderer.dice.tk.COUNT_SUCCESS_GT);
                        break;
                    case "cs>=":
                        a.tokenStack.push(Renderer.dice.tk.COUNT_SUCCESS_GTEQ);
                        break;
                    case "cs<":
                        a.tokenStack.push(Renderer.dice.tk.COUNT_SUCCESS_LT);
                        break;
                    case "cs<=":
                        a.tokenStack.push(Renderer.dice.tk.COUNT_SUCCESS_LTEQ);
                        break;
                    default:
                        if (Renderer.dice.lang._M_NUMBER.test(a.token)) {
                            if (
                                2 <
                                a.token.split(Parser._decimalSeparator).length
                            )
                                throw new Error(
                                    `Syntax error: too many decimal separators <code>${a.token}</code>`
                                );
                            a.tokenStack.push(Renderer.dice.tk.NUMBER(a.token));
                        } else
                            throw new Error(
                                `Syntax error: unexpected token <code>${a.token}</code>`
                            );
                }
                a.token = "";
            }
        },
        _parse3(a) {
            const b = { ixSym: -1, syms: a, sym: null, lastAccepted: null };
            return this._parse3_nextSym(b), this._parse3_expression(b);
        },
        _parse3_nextSym(a) {
            const b = a.syms[a.ixSym];
            return a.ixSym++, (a.sym = a.syms[a.ixSym]), b;
        },
        _parse3_match(a, b) {
            return null != a.sym && (b.type && (b = b.type), a.sym.type === b);
        },
        _parse3_accept(a, b) {
            if (this._parse3_match(a, b)) {
                const b = a.sym;
                return this._parse3_nextSym(a), (a.lastAccepted = b), b;
            }
            return !1;
        },
        _parse3_expect(a, b) {
            const c = this._parse3_accept(a, b);
            if (c) return c;
            if (a.sym)
                throw new Error(
                    `Unexpected input: Expected <code>${b}</code> but found <code>${a.sym}</code>`
                );
            else
                throw new Error(
                    `Unexpected end of input: Expected <code>${b}</code>`
                );
        },
        _parse3_factor(a) {
            if (this._parse3_accept(a, Renderer.dice.tk.TYP_NUMBER)) {
                const b = [a.lastAccepted];
                for (; this._parse3_accept(a, Renderer.dice.tk.COMMA); ) {
                    const c = this._parse3_expect(
                        a,
                        Renderer.dice.tk.TYP_NUMBER
                    );
                    b.push(c);
                }
                const c = Renderer.dice.tk.NUMBER(
                    b.map((a) => a.value).join("")
                );
                return new Renderer.dice.parsed.Factor(c);
            }
            if (
                this._parse3_match(a, Renderer.dice.tk.FLOOR) ||
                this._parse3_match(a, Renderer.dice.tk.CEIL) ||
                this._parse3_match(a, Renderer.dice.tk.ROUND) ||
                this._parse3_match(a, Renderer.dice.tk.AVERAGE)
            ) {
                const b = [];
                return (
                    b.push(this._parse3_nextSym(a)),
                    this._parse3_expect(a, Renderer.dice.tk.PAREN_OPEN),
                    b.push(this._parse3_expression(a)),
                    this._parse3_expect(a, Renderer.dice.tk.PAREN_CLOSE),
                    new Renderer.dice.parsed.Function(b)
                );
            }
            if (this._parse3_accept(a, Renderer.dice.tk.PAREN_OPEN)) {
                const b = this._parse3_expression(a);
                return (
                    this._parse3_expect(a, Renderer.dice.tk.PAREN_CLOSE),
                    new Renderer.dice.parsed.Factor(b, { hasParens: !0 })
                );
            }
            if (this._parse3_accept(a, Renderer.dice.tk.BRACE_OPEN)) {
                const b = [this._parse3_expression(a)];
                for (; this._parse3_accept(a, Renderer.dice.tk.COMMA); )
                    b.push(this._parse3_expression(a));
                this._parse3_expect(a, Renderer.dice.tk.BRACE_CLOSE);
                const c = [];
                return (
                    this._parse3__dice_modifiers(a, c),
                    new Renderer.dice.parsed.Pool(b, c)
                );
            }
            if (a.sym)
                throw new Error(`Unexpected input: <code>${a.sym}</code>`);
            else throw new Error(`Unexpected end of input`);
        },
        _parse3_dice(a) {
            const b = [];
            for (
                this._parse3_match(a, Renderer.dice.tk.DICE)
                    ? b.push(
                          new Renderer.dice.parsed.Factor(
                              Renderer.dice.tk.NUMBER(1)
                          )
                      )
                    : b.push(this._parse3_factor(a));
                this._parse3_match(a, Renderer.dice.tk.DICE);

            )
                this._parse3_nextSym(a),
                    b.push(this._parse3_factor(a)),
                    this._parse3__dice_modifiers(a, b);
            return new Renderer.dice.parsed.Dice(b);
        },
        _parse3__dice_modifiers(a, b) {
            (this._parse3_match(a, Renderer.dice.tk.DROP_HIGHEST) ||
                this._parse3_match(a, Renderer.dice.tk.KEEP_HIGHEST) ||
                this._parse3_match(a, Renderer.dice.tk.DROP_LOWEST) ||
                this._parse3_match(a, Renderer.dice.tk.KEEP_LOWEST) ||
                this._parse3_match(a, Renderer.dice.tk.REROLL_EXACT) ||
                this._parse3_match(a, Renderer.dice.tk.REROLL_GT) ||
                this._parse3_match(a, Renderer.dice.tk.REROLL_GTEQ) ||
                this._parse3_match(a, Renderer.dice.tk.REROLL_LT) ||
                this._parse3_match(a, Renderer.dice.tk.REROLL_LTEQ) ||
                this._parse3_match(a, Renderer.dice.tk.EXPLODE_EXACT) ||
                this._parse3_match(a, Renderer.dice.tk.EXPLODE_GT) ||
                this._parse3_match(a, Renderer.dice.tk.EXPLODE_GTEQ) ||
                this._parse3_match(a, Renderer.dice.tk.EXPLODE_LT) ||
                this._parse3_match(a, Renderer.dice.tk.EXPLODE_LTEQ) ||
                this._parse3_match(a, Renderer.dice.tk.COUNT_SUCCESS_EXACT) ||
                this._parse3_match(a, Renderer.dice.tk.COUNT_SUCCESS_GT) ||
                this._parse3_match(a, Renderer.dice.tk.COUNT_SUCCESS_GTEQ) ||
                this._parse3_match(a, Renderer.dice.tk.COUNT_SUCCESS_LT) ||
                this._parse3_match(a, Renderer.dice.tk.COUNT_SUCCESS_LTEQ)) &&
                (b.push(this._parse3_nextSym(a)),
                b.push(this._parse3_factor(a)));
        },
        _parse3_exponent(a) {
            const b = [this._parse3_dice(a)];
            for (; this._parse3_match(a, Renderer.dice.tk.POW); )
                this._parse3_nextSym(a), b.push(this._parse3_dice(a));
            return new Renderer.dice.parsed.Exponent(b);
        },
        _parse3_term(a) {
            const b = [this._parse3_exponent(a)];
            for (
                ;
                this._parse3_match(a, Renderer.dice.tk.MULT) ||
                this._parse3_match(a, Renderer.dice.tk.DIV);

            )
                b.push(this._parse3_nextSym(a)),
                    b.push(this._parse3_exponent(a));
            return new Renderer.dice.parsed.Term(b);
        },
        _parse3_expression(a) {
            const b = [];
            for (
                (this._parse3_match(a, Renderer.dice.tk.ADD) ||
                    this._parse3_match(a, Renderer.dice.tk.SUB)) &&
                    b.push(this._parse3_nextSym(a)),
                    b.push(this._parse3_term(a));
                this._parse3_match(a, Renderer.dice.tk.ADD) ||
                this._parse3_match(a, Renderer.dice.tk.SUB);

            )
                b.push(this._parse3_nextSym(a)), b.push(this._parse3_term(a));
            return new Renderer.dice.parsed.Expression(b);
        },
    }),
    (Renderer.dice.tk = {
        Token: class {
            constructor(a, b, c, d) {
                (d = d || {}),
                    (this.type = a),
                    (this.value = b),
                    (this._asString = c),
                    d.isDiceModifier && (this.isDiceModifier = !0),
                    d.isSuccessMode && (this.isSuccessMode = !0);
            }
            eq(a) {
                return a && a.type === this.type;
            }
            toString() {
                return this._asString ? this._asString : this.toDebugString();
            }
            toDebugString() {
                return `${this.type}${this.value ? ` :: ${this.value}` : ""}`;
            }
        },
        _new(a, b, c) {
            return new Renderer.dice.tk.Token(a, null, b, c);
        },
        TYP_NUMBER: "NUMBER",
        TYP_DICE: "DICE",
        TYP_SYMBOL: "SYMBOL",
        NUMBER(a) {
            return new Renderer.dice.tk.Token(Renderer.dice.tk.TYP_NUMBER, a);
        },
    }),
    (Renderer.dice.tk.PAREN_OPEN = Renderer.dice.tk._new("PAREN_OPEN", "(")),
    (Renderer.dice.tk.PAREN_CLOSE = Renderer.dice.tk._new("PAREN_CLOSE", ")")),
    (Renderer.dice.tk.BRACE_OPEN = Renderer.dice.tk._new("BRACE_OPEN", "{")),
    (Renderer.dice.tk.BRACE_CLOSE = Renderer.dice.tk._new("BRACE_CLOSE", "}")),
    (Renderer.dice.tk.COMMA = Renderer.dice.tk._new("COMMA", ",")),
    (Renderer.dice.tk.ADD = Renderer.dice.tk._new("ADD", "+")),
    (Renderer.dice.tk.SUB = Renderer.dice.tk._new("SUB", "-")),
    (Renderer.dice.tk.MULT = Renderer.dice.tk._new("MULT", "*")),
    (Renderer.dice.tk.DIV = Renderer.dice.tk._new("DIV", "/")),
    (Renderer.dice.tk.POW = Renderer.dice.tk._new("POW", "^")),
    (Renderer.dice.tk.FLOOR = Renderer.dice.tk._new("FLOOR", "floor")),
    (Renderer.dice.tk.CEIL = Renderer.dice.tk._new("CEIL", "ceil")),
    (Renderer.dice.tk.ROUND = Renderer.dice.tk._new("ROUND", "round")),
    (Renderer.dice.tk.AVERAGE = Renderer.dice.tk._new("AVERAGE", "avg")),
    (Renderer.dice.tk.DICE = Renderer.dice.tk._new("DICE", "d")),
    (Renderer.dice.tk.DROP_HIGHEST = Renderer.dice.tk._new("DH", "dh", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.KEEP_HIGHEST = Renderer.dice.tk._new("KH", "kh", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.DROP_LOWEST = Renderer.dice.tk._new("DL", "dl", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.KEEP_LOWEST = Renderer.dice.tk._new("KL", "kl", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.REROLL_EXACT = Renderer.dice.tk._new("REROLL", "r", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.REROLL_GT = Renderer.dice.tk._new("REROLL_GT", "r>", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.REROLL_GTEQ = Renderer.dice.tk._new(
        "REROLL_GTEQ",
        "r>=",
        { isDiceModifier: !0 }
    )),
    (Renderer.dice.tk.REROLL_LT = Renderer.dice.tk._new("REROLL_LT", "r<", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.REROLL_LTEQ = Renderer.dice.tk._new(
        "REROLL_LTEQ",
        "r<=",
        { isDiceModifier: !0 }
    )),
    (Renderer.dice.tk.EXPLODE_EXACT = Renderer.dice.tk._new("EXPLODE", "x", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.EXPLODE_GT = Renderer.dice.tk._new("EXPLODE_GT", "x>", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.EXPLODE_GTEQ = Renderer.dice.tk._new(
        "EXPLODE_GTEQ",
        "x>=",
        { isDiceModifier: !0 }
    )),
    (Renderer.dice.tk.EXPLODE_LT = Renderer.dice.tk._new("EXPLODE_LT", "x<", {
        isDiceModifier: !0,
    })),
    (Renderer.dice.tk.EXPLODE_LTEQ = Renderer.dice.tk._new(
        "EXPLODE_LTEQ",
        "x<=",
        { isDiceModifier: !0 }
    )),
    (Renderer.dice.tk.COUNT_SUCCESS_EXACT = Renderer.dice.tk._new(
        "COUNT_SUCCESS_EXACT",
        "cs=",
        { isDiceModifier: !0, isSuccessMode: !0 }
    )),
    (Renderer.dice.tk.COUNT_SUCCESS_GT = Renderer.dice.tk._new(
        "COUNT_SUCCESS_GT",
        "cs>",
        { isDiceModifier: !0, isSuccessMode: !0 }
    )),
    (Renderer.dice.tk.COUNT_SUCCESS_GTEQ = Renderer.dice.tk._new(
        "COUNT_SUCCESS_GTEQ",
        "cs>=",
        { isDiceModifier: !0, isSuccessMode: !0 }
    )),
    (Renderer.dice.tk.COUNT_SUCCESS_LT = Renderer.dice.tk._new(
        "COUNT_SUCCESS_LT",
        "cs<",
        { isDiceModifier: !0, isSuccessMode: !0 }
    )),
    (Renderer.dice.tk.COUNT_SUCCESS_LTEQ = Renderer.dice.tk._new(
        "COUNT_SUCCESS_LTEQ",
        "cs<=",
        { isDiceModifier: !0, isSuccessMode: !0 }
    )),
    (Renderer.dice.AbstractSymbol = class {
        constructor() {
            this.type = Renderer.dice.tk.TYP_SYMBOL;
        }
        eq(a) {
            return a && this.type === a.type;
        }
        evl() {
            throw new Error("Unimplemented!");
        }
        avg() {
            throw new Error("Unimplemented!");
        }
        min() {
            throw new Error("Unimplemented!");
        }
        max() {
            throw new Error("Unimplemented!");
        }
        toString() {
            throw new Error("Unimplemented!");
        }
        addToMeta(a, b, c) {
            a &&
                ((c = c || b),
                (a.html = a.html || []),
                (a.text = a.text || []),
                a.html.push(b),
                a.text.push(c));
        }
    }),
    (Renderer.dice.parsed = {
        _PARTITION_EQ: (a, b) => a === b,
        _PARTITION_GT: (a, b) => a > b,
        _PARTITION_GTEQ: (a, b) => a >= b,
        _PARTITION_LT: (a, b) => a < b,
        _PARTITION_LTEQ: (a, b) => a <= b,
        _handleModifiers(a, b, c, d, e) {
            e = e || {};
            const f = c.slice();
            c.sort(SortUtil.ascSortProp.bind(null, "val")).reverse();
            const [g, h] = d,
                i = h[a]();
            switch (g.type) {
                case Renderer.dice.tk.DROP_HIGHEST.type:
                case Renderer.dice.tk.KEEP_HIGHEST.type:
                case Renderer.dice.tk.DROP_LOWEST.type:
                case Renderer.dice.tk.KEEP_LOWEST.type: {
                    const a = g.type.endsWith("H"),
                        b = a ? i : c.length - i,
                        d = c.slice(0, b),
                        e = c.slice(b, c.length);
                    switch (g.type) {
                        case Renderer.dice.tk.DROP_HIGHEST.type:
                        case Renderer.dice.tk.KEEP_LOWEST.type:
                            d.forEach((a) => (a.isDropped = !0));
                            break;
                        case Renderer.dice.tk.KEEP_HIGHEST.type:
                        case Renderer.dice.tk.DROP_LOWEST.type:
                            e.forEach((a) => (a.isDropped = !0));
                            break;
                        default:
                            throw new Error(`Unimplemented!`);
                    }
                    break;
                }
                case Renderer.dice.tk.REROLL_EXACT.type:
                case Renderer.dice.tk.REROLL_GT.type:
                case Renderer.dice.tk.REROLL_GTEQ.type:
                case Renderer.dice.tk.REROLL_LT.type:
                case Renderer.dice.tk.REROLL_LTEQ.type: {
                    let a;
                    switch (g.type) {
                        case Renderer.dice.tk.REROLL_EXACT.type:
                            a = Renderer.dice.parsed._PARTITION_EQ;
                            break;
                        case Renderer.dice.tk.REROLL_GT.type:
                            a = Renderer.dice.parsed._PARTITION_GT;
                            break;
                        case Renderer.dice.tk.REROLL_GTEQ.type:
                            a = Renderer.dice.parsed._PARTITION_GTEQ;
                            break;
                        case Renderer.dice.tk.REROLL_LT.type:
                            a = Renderer.dice.parsed._PARTITION_LT;
                            break;
                        case Renderer.dice.tk.REROLL_LTEQ.type:
                            a = Renderer.dice.parsed._PARTITION_LTEQ;
                            break;
                        default:
                            throw new Error(`Unimplemented!`);
                    }
                    const b = c.filter((b) => a(b.val, i));
                    b.forEach((a) => (a.isDropped = !0));
                    const d = e.fnGetRerolls(b);
                    c.push(...d), f.push(...d);
                    break;
                }
                case Renderer.dice.tk.EXPLODE_EXACT.type:
                case Renderer.dice.tk.EXPLODE_GT.type:
                case Renderer.dice.tk.EXPLODE_GTEQ.type:
                case Renderer.dice.tk.EXPLODE_LT.type:
                case Renderer.dice.tk.EXPLODE_LTEQ.type: {
                    let a;
                    switch (g.type) {
                        case Renderer.dice.tk.EXPLODE_EXACT.type:
                            a = Renderer.dice.parsed._PARTITION_EQ;
                            break;
                        case Renderer.dice.tk.EXPLODE_GT.type:
                            a = Renderer.dice.parsed._PARTITION_GT;
                            break;
                        case Renderer.dice.tk.EXPLODE_GTEQ.type:
                            a = Renderer.dice.parsed._PARTITION_GTEQ;
                            break;
                        case Renderer.dice.tk.EXPLODE_LT.type:
                            a = Renderer.dice.parsed._PARTITION_LT;
                            break;
                        case Renderer.dice.tk.EXPLODE_LTEQ.type:
                            a = Renderer.dice.parsed._PARTITION_LTEQ;
                            break;
                        default:
                            throw new Error(`Unimplemented!`);
                    }
                    let b,
                        d = 999,
                        h = c;
                    do {
                        b = c.length;
                        const [d] = h.partition(
                            (b) => !b.isExploded && a(b.val, i)
                        );
                        d.forEach((a) => (a.isExploded = !0));
                        const g = e.fnGetExplosions(d);
                        (h = g), c.push(...g), f.push(...g);
                    } while (0 < d-- && c.length !== b);
                    ~d ||
                        JqueryUtil.doToast({
                            type: "warning",
                            content: `Stopped exploding after 999 additional rolls.`,
                        });
                    break;
                }
                case Renderer.dice.tk.COUNT_SUCCESS_EXACT.type:
                case Renderer.dice.tk.COUNT_SUCCESS_GT.type:
                case Renderer.dice.tk.COUNT_SUCCESS_GTEQ.type:
                case Renderer.dice.tk.COUNT_SUCCESS_LT.type:
                case Renderer.dice.tk.COUNT_SUCCESS_LTEQ.type: {
                    let a;
                    switch (g.type) {
                        case Renderer.dice.tk.COUNT_SUCCESS_EXACT.type:
                            a = Renderer.dice.parsed._PARTITION_EQ;
                            break;
                        case Renderer.dice.tk.COUNT_SUCCESS_GT.type:
                            a = Renderer.dice.parsed._PARTITION_GT;
                            break;
                        case Renderer.dice.tk.COUNT_SUCCESS_GTEQ.type:
                            a = Renderer.dice.parsed._PARTITION_GTEQ;
                            break;
                        case Renderer.dice.tk.COUNT_SUCCESS_LT.type:
                            a = Renderer.dice.parsed._PARTITION_LT;
                            break;
                        case Renderer.dice.tk.COUNT_SUCCESS_LTEQ.type:
                            a = Renderer.dice.parsed._PARTITION_LTEQ;
                            break;
                        default:
                            throw new Error(`Unimplemented!`);
                    }
                    const b = c.filter((b) => a(b.val, i));
                    b.forEach((a) => (a.isSuccess = !0));
                    break;
                }
                default:
                    throw new Error(`Unimplemented!`);
            }
            return f;
        },
        Function: class extends Renderer.dice.AbstractSymbol {
            constructor(a) {
                super(), (this._nodes = a);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                const [c, d] = this._nodes;
                switch (c.type) {
                    case Renderer.dice.tk.FLOOR.type: {
                        this.addToMeta(b, "floor(");
                        const c = Math.floor(d[a](b));
                        return this.addToMeta(b, ")"), c;
                    }
                    case Renderer.dice.tk.CEIL.type: {
                        this.addToMeta(b, "ceil(");
                        const c = Math.ceil(d[a](b));
                        return this.addToMeta(b, ")"), c;
                    }
                    case Renderer.dice.tk.ROUND.type: {
                        this.addToMeta(b, "round(");
                        const c = Math.round(d[a](b));
                        return this.addToMeta(b, ")"), c;
                    }
                    case Renderer.dice.tk.AVERAGE.type:
                        return d.avg(b);
                    default:
                        throw new Error(`Unimplemented!`);
                }
            }
            toString() {
                let a;
                const [b, c] = this._nodes;
                switch (b.type) {
                    case Renderer.dice.tk.FLOOR.type:
                        a = "floor";
                        break;
                    case Renderer.dice.tk.CEIL.type:
                        a = "ceil";
                        break;
                    case Renderer.dice.tk.ROUND.type:
                        a = "round";
                        break;
                    case Renderer.dice.tk.AVERAGE.type:
                        a = "avg";
                        break;
                    default:
                        throw new Error(`Unimplemented!`);
                }
                return (a += `(${c.toString()})`), a;
            }
        },
        Pool: class extends Renderer.dice.AbstractSymbol {
            constructor(a, b) {
                super(), (this._nodesPool = a), (this._nodesMod = b);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                var c = Math.sum;
                const d = this._nodesPool.map((b) => {
                    const c = {};
                    return { node: b, val: b[a](c), meta: c };
                });
                if (this._nodesMod.length && d.length) {
                    const e = this._nodesMod[0].isSuccessMode,
                        f = Renderer.dice.parsed._handleModifiers(
                            a,
                            b,
                            d,
                            this._nodesMod,
                            {
                                fnGetRerolls: (b) =>
                                    b.map((b) => {
                                        const c = {};
                                        return {
                                            node: b.node,
                                            val: b.node[a](c),
                                            meta: c,
                                        };
                                    }),
                                fnGetExplosions: (b) =>
                                    b.map((b) => {
                                        const c = {};
                                        return {
                                            node: b.node,
                                            val: b.node[a](c),
                                            meta: c,
                                        };
                                    }),
                            }
                        ),
                        g = f
                            .map((a) => {
                                const b = a.meta.html.join("");
                                return a.isDropped
                                    ? `<span class="rll__dropped">(${b})</span>`
                                    : a.isExploded
                                    ? `<span class="rll__exploded">(</span>${b}<span class="rll__exploded">)</span>`
                                    : a.isSuccess
                                    ? `<span class="rll__success">(${b})</span>`
                                    : `(${b})`;
                            })
                            .join("+"),
                        h = f.map((a) => `(${a.meta.text.join("")})`).join("+");
                    return (
                        this.addToMeta(b, g, h),
                        e
                            ? d.filter((a) => !a.isDropped && a.isSuccess)
                                  .length
                            : c(
                                  ...d
                                      .filter((a) => !a.isDropped)
                                      .map((a) => a.val)
                              )
                    );
                }
                return (
                    this.addToMeta(
                        b,
                        `${d
                            .map((a) => `(${a.meta.html.join("")})`)
                            .join("+")}`,
                        `${d.map((a) => `(${a.meta.text.join("")})`).join("+")}`
                    ),
                    c(...d.map((a) => a.val))
                );
            }
            toString() {
                return `{${this._nodesPool
                    .map((a) => a.toString())
                    .join(", ")}}${this._nodesMod
                    .map((a) => a.toString())
                    .join("")}`;
            }
        },
        Factor: class extends Renderer.dice.AbstractSymbol {
            constructor(a, b) {
                super(),
                    (b = b || {}),
                    (this._node = a),
                    (this._hasParens = !!b.hasParens);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                switch (this._node.type) {
                    case Renderer.dice.tk.TYP_NUMBER:
                        return (
                            this.addToMeta(b, this.toString()),
                            +this._node.value
                        );
                    case Renderer.dice.tk.TYP_SYMBOL: {
                        this._hasParens && this.addToMeta(b, "(");
                        const c = this._node[a](b);
                        return this._hasParens && this.addToMeta(b, ")"), c;
                    }
                    default:
                        throw new Error(`Unimplemented!`);
                }
            }
            toString() {
                let a;
                switch (this._node.type) {
                    case Renderer.dice.tk.TYP_NUMBER:
                        a = this._node.value;
                        break;
                    case Renderer.dice.tk.TYP_SYMBOL:
                        a = this._node.toString();
                        break;
                    default:
                        throw new Error(`Unimplemented!`);
                }
                return this._hasParens ? `(${a})` : a;
            }
        },
        Dice: class extends Renderer.dice.AbstractSymbol {
            static _facesToValue(a, b) {
                return "evl" === b
                    ? RollerUtil.randomise(a)
                    : "avg" === b
                    ? (a + 1) / 2
                    : "min" === b
                    ? 1
                    : "max" === b
                    ? a
                    : void 0;
            }
            constructor(a) {
                super(), (this._nodes = a);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                if (1 === this._nodes.length) return this._nodes[0][a](b);
                const c = this._nodes.slice(),
                    d = c.shift();
                let e = d[a]();
                for (; c.length; ) {
                    if (Math.round(e) !== e)
                        throw new Error(
                            `Number of dice to roll (${e}) was not an integer!`
                        );
                    const d =
                        1 === c.length ||
                        (3 === c.length && c.slice(-2, -1)[0].isDiceModifier);
                    e = this._invoke_handlePart(a, b, c, e, d);
                }
                return e;
            }
            _invoke_handlePart(a, b, c, d, e) {
                var f = Math.sum;
                const g = c.shift(),
                    h = g[a]();
                if (Math.round(h) !== h)
                    throw new Error(
                        `Dice face count (${h}) was not an integer!`
                    );
                const i = [...Array(d)].map(() => ({
                    val: Renderer.dice.parsed.Dice._facesToValue(h, a),
                }));
                let j,
                    k = !1;
                if (c.length && c[0].isDiceModifier) {
                    if ("evl" === a || "min" === a || "max" === a) {
                        k = c[0].isSuccessMode;
                        j = Renderer.dice.parsed._handleModifiers(a, b, i, c, {
                            fnGetRerolls: (b) =>
                                [...Array(b.length)].map(() => ({
                                    val: Renderer.dice.parsed.Dice._facesToValue(
                                        h,
                                        a
                                    ),
                                })),
                            fnGetExplosions: (b) =>
                                [...Array(b.length)].map(() => ({
                                    val: Renderer.dice.parsed.Dice._facesToValue(
                                        h,
                                        a
                                    ),
                                })),
                        });
                    }
                    c.shift(), c.shift();
                } else j = i;
                if (e) {
                    const a = j
                            .map((a) => {
                                const b =
                                    a.val === h
                                        ? `<span class="rll__max--muted">${a.val}</span>`
                                        : 1 === a.val
                                        ? `<span class="rll__min--muted">${a.val}</span>`
                                        : a.val;
                                return a.isDropped
                                    ? `<span class="rll__dropped">[${b}]</span>`
                                    : a.isExploded
                                    ? `<span class="rll__exploded">[</span>${b}<span class="rll__exploded">]</span>`
                                    : a.isSuccess
                                    ? `<span class="rll__success">[${b}]</span>`
                                    : `[${b}]`;
                            })
                            .join("+"),
                        c = j.map((a) => `[${a.val}]`).join("+");
                    this.addToMeta(b, a, c);
                }
                if ("evl" === a) {
                    const a = i.filter((a) => a.val === h && !a.isDropped),
                        c = i.filter((a) => 1 === a.val && !a.isDropped);
                    (b.allMax = b.allMax || []),
                        (b.allMin = b.allMin || []),
                        b.allMax.push(a.length && a.length === i.length),
                        b.allMin.push(c.length && c.length === i.length);
                }
                return k
                    ? i.filter((a) => !a.isDropped && a.isSuccess).length
                    : f(...i.filter((a) => !a.isDropped).map((a) => a.val));
            }
            toString() {
                if (1 === this._nodes.length) return this._nodes[0].toString();
                const [a, b] = this._nodes;
                let c = `${a.toString()}d${b.toString()}`;
                if (4 === this._nodes.length) {
                    const [a, b] = this._nodes.slice(2);
                    c += `${a.toString()}${b.toString()}`;
                }
                return c;
            }
        },
        Exponent: class extends Renderer.dice.AbstractSymbol {
            constructor(a) {
                super(), (this._nodes = a);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                const c = this._nodes.slice();
                let d = c.pop()[a](b);
                for (; c.length; )
                    this.addToMeta(b, "^"), (d = c.pop()[a](b) ** d);
                return d;
            }
            toString() {
                const a = this._nodes.slice();
                let b = a.pop().toString();
                for (; a.length; ) b = `${a.pop().toString()}^${b}`;
                return b;
            }
        },
        Term: class extends Renderer.dice.AbstractSymbol {
            constructor(a) {
                super(), (this._nodes = a);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                let c = this._nodes[0][a](b);
                for (let d = 1; d < this._nodes.length; d += 2)
                    if (this._nodes[d].eq(Renderer.dice.tk.MULT))
                        this.addToMeta(b, " \xD7 "),
                            (c *= this._nodes[d + 1][a](b));
                    else if (this._nodes[d].eq(Renderer.dice.tk.DIV))
                        this.addToMeta(b, " \xF7 "),
                            (c /= this._nodes[d + 1][a](b));
                    else throw new Error(`Unimplemented!`);
                return c;
            }
            toString() {
                let a = this._nodes[0].toString();
                for (let b = 1; b < this._nodes.length; b += 2)
                    if (this._nodes[b].eq(Renderer.dice.tk.MULT))
                        a += ` * ${this._nodes[b + 1].toString()}`;
                    else if (this._nodes[b].eq(Renderer.dice.tk.DIV))
                        a += ` / ${this._nodes[b + 1].toString()}`;
                    else throw new Error(`Unimplemented!`);
                return a;
            }
        },
        Expression: class extends Renderer.dice.AbstractSymbol {
            constructor(a) {
                super(), (this._nodes = a);
            }
            evl(a) {
                return this._invoke("evl", a);
            }
            avg(a) {
                return this._invoke("avg", a);
            }
            min(a) {
                return this._invoke("min", a);
            }
            max(a) {
                return this._invoke("max", a);
            }
            _invoke(a, b) {
                const c = this._nodes.slice();
                let d = !1;
                (c[0].eq(Renderer.dice.tk.ADD) ||
                    c[0].eq(Renderer.dice.tk.SUB)) &&
                    ((d = c.shift().eq(Renderer.dice.tk.SUB)),
                    d && this.addToMeta(b, "-"));
                let e = c[0][a](b);
                d && (e = -e);
                for (let d = 1; d < c.length; d += 2)
                    if (c[d].eq(Renderer.dice.tk.ADD))
                        this.addToMeta(b, " + "), (e += c[d + 1][a](b));
                    else if (c[d].eq(Renderer.dice.tk.SUB))
                        this.addToMeta(b, " - "), (e -= c[d + 1][a](b));
                    else throw new Error(`Unimplemented!`);
                return e;
            }
            toString(a = 0) {
                let b = "";
                const c = this._nodes.slice();
                let d = !1;
                (c[0].eq(Renderer.dice.tk.ADD) ||
                    c[0].eq(Renderer.dice.tk.SUB)) &&
                    ((d = c.shift().eq(Renderer.dice.tk.SUB)), d && (b += "-")),
                    (b += c[0].toString(a));
                for (let d = 1; d < c.length; d += 2)
                    if (c[d].eq(Renderer.dice.tk.ADD))
                        b += ` + ${c[d + 1].toString(a)}`;
                    else if (c[d].eq(Renderer.dice.tk.SUB))
                        b += ` - ${c[d + 1].toString(a)}`;
                    else throw new Error(`Unimplemented!`);
                return b;
            }
        },
    }),
    IS_VTT ||
        "undefined" == typeof window ||
        window.addEventListener("load", Renderer.dice._pInit);
