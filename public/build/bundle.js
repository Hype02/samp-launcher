
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var fluide = (function (require$$0, path$1, url, require$$0$1, require$$1) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
    var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
    var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
    var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
    var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    function hostMatches(anchor) {
      const host = location.host;
      return (
        anchor.host == host ||
        // svelte seems to kill anchor.host value in ie11, so fall back to checking href
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
      )
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.38.2 */

    function create_fragment$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.38.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    function link(node) {
      function onClick(event) {
        const anchor = event.currentTarget;

        if (
          anchor.target === "" &&
          hostMatches(anchor) &&
          shouldNavigate(event)
        ) {
          event.preventDefault();
          navigate(anchor.pathname + anchor.search, { replace: anchor.hasAttribute("replace") });
        }
      }

      node.addEventListener("click", onClick);

      return {
        destroy() {
          node.removeEventListener("click", onClick);
        }
      };
    }

    /* src/frontend/components/Nord.svelte generated by Svelte v3.38.2 */

    function create_fragment$5(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nord", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nord> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Nord extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nord",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/frontend/components/ServerList.svelte generated by Svelte v3.38.2 */

    const file$4 = "src/frontend/components/ServerList.svelte";

    function create_fragment$4(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Server list";
    			add_location(h1, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ServerList", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ServerList> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ServerList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ServerList",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/frontend/components/Options.svelte generated by Svelte v3.38.2 */

    const file$3 = "src/frontend/components/Options.svelte";

    function create_fragment$3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Options";
    			add_location(h1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Options", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Options> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Options extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Options",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/frontend/components/Header.svelte generated by Svelte v3.38.2 */
    const file$2 = "src/frontend/components/Header.svelte";

    // (45:4) <Router url="">
    function create_default_slot$1(ctx) {
    	let div0;
    	let a0;
    	let t1;
    	let div1;
    	let a1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Server list";
    			t1 = space();
    			div1 = element("div");
    			a1 = element("a");
    			a1.textContent = "Options";
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$2, 45, 44, 1280);
    			attr_dev(div0, "id", "master");
    			attr_dev(div0, "class", "tab active svelte-1809ulr");
    			add_location(div0, file$2, 45, 8, 1244);
    			attr_dev(a1, "href", "/options");
    			add_location(a1, file$2, 46, 38, 1404);
    			attr_dev(div1, "id", "options");
    			attr_dev(div1, "class", "tab svelte-1809ulr");
    			add_location(div1, file$2, 46, 8, 1374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[0], false, false, false),
    					action_destroyer(link.call(null, a0)),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					action_destroyer(link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(45:4) <Router url=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: "",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(div, "class", "header svelte-1809ulr");
    			add_location(div, file$2, 43, 0, 1195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function updateTab() {
    	var _a, _b, _c, _d;

    	if (window.location.pathname == "/options") {
    		(_a = document.getElementById("options")) === null || _a === void 0
    		? void 0
    		: _a.classList.add("active");

    		(_b = document.getElementById("master")) === null || _b === void 0
    		? void 0
    		: _b.classList.remove("active");
    	}

    	if (window.location.pathname == "/") {
    		(_c = document.getElementById("master")) === null || _c === void 0
    		? void 0
    		: _c.classList.add("active");

    		(_d = document.getElementById("options")) === null || _d === void 0
    		? void 0
    		: _d.classList.remove("active");
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	window.document.body.classList.toggle("dark-mode");
    	
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setTimeout(updateTab, 10);
    	const click_handler_1 = () => setTimeout(updateTab, 10);
    	$$self.$capture_state = () => ({ Router, link, updateTab });
    	return [click_handler, click_handler_1];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    class ServerInfo {
        ip;
        title;
        worldTime;
        ping;
        gameMode;
        language;
        lagcomp;
        version;
        constructor(ip, title, worldTime, ping, gameMode, language, version, lagComp) {
            this.ip = ip;
            this.title = title;
            this.worldTime = worldTime;
            this.gameMode = gameMode;
            this.ping = ping;
            this.version = version;
            this.language = language;
            this.lagcomp = lagComp;
        }
    }
    class SampApi {
        constructor() { }
        static async GetAllServersList() {
            let fetchedServersResponse = await fetch("https://api.open.mp/servers", {
                mode: "cors",
            });
            let fetchedServersArray = await fetchedServersResponse.json();
            let serversTypedArray = [];
            for (let i = 0; i < fetchedServersArray.length; i++) {
                const { ip, hn, pc, pm, gm, la, vn, pa } = fetchedServersArray[i];
                let serverToPush = new ServerInfo(ip, hn, pc, pm, gm, la, vn, pa);
                serversTypedArray.push(serverToPush);
            }
            return serversTypedArray;
        }
    }

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    const fs = require$$0__default['default'];
    const path = path__default['default'];

    const pathFile = path.join(__dirname, 'path.txt');

    function getElectronPath () {
      let executablePath;
      if (fs.existsSync(pathFile)) {
        executablePath = fs.readFileSync(pathFile, 'utf-8');
      }
      if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
        return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || 'electron');
      }
      if (executablePath) {
        return path.join(__dirname, 'dist', executablePath);
      } else {
        throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again');
      }
    }

    var electron = getElectronPath();

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$2 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    let register;
    try {
      const { app } = require$$2;
      register = app.setAsDefaultProtocolClient.bind(app);
    } catch (err) {
      try {
        register = require$$2;
      } catch (e) {} // eslint-disable-line no-empty
    }

    if (typeof register !== 'function') {
      register = () => false;
    }

    function pid() {
      if (typeof process !== 'undefined') {
        return process.pid;
      }
      return null;
    }

    const uuid4122 = () => {
      let uuid = '';
      for (let i = 0; i < 32; i += 1) {
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        let n;
        if (i === 12) {
          n = 4;
        } else {
          const random = Math.random() * 16 | 0;
          if (i === 16) {
            n = (random & 3) | 0;
          } else {
            n = random;
          }
        }
        uuid += n.toString(16);
      }
      return uuid;
    };

    var util$1 = {
      pid,
      register,
      uuid: uuid4122,
    };

    var browser$1 = {exports: {}};

    (function (module, exports) {

    // ref: https://github.com/tc39/proposal-global
    var getGlobal = function () {
    	// the only reliable means to get the global object is
    	// `Function('return this')()`
    	// However, this causes CSP violations in Chrome apps.
    	if (typeof self !== 'undefined') { return self; }
    	if (typeof window !== 'undefined') { return window; }
    	if (typeof global !== 'undefined') { return global; }
    	throw new Error('unable to locate global object');
    };

    var global = getGlobal();

    module.exports = exports = global.fetch;

    // Needed for TypeScript and Webpack.
    if (global.fetch) {
    	exports.default = global.fetch.bind(global);
    }

    exports.Headers = global.Headers;
    exports.Request = global.Request;
    exports.Response = global.Response;
    }(browser$1, browser$1.exports));

    var ipc = {exports: {}};

    const net = require$$2;
    const EventEmitter$2 = require$$0__default$1['default'];
    const fetch$2 = browser$1.exports;
    const { uuid: uuid$1 } = util$1;

    const OPCodes = {
      HANDSHAKE: 0,
      FRAME: 1,
      CLOSE: 2,
      PING: 3,
      PONG: 4,
    };

    function getIPCPath(id) {
      if (process.platform === 'win32') {
        return `\\\\?\\pipe\\discord-ipc-${id}`;
      }
      const { env: { XDG_RUNTIME_DIR, TMPDIR, TMP, TEMP } } = process;
      const prefix = XDG_RUNTIME_DIR || TMPDIR || TMP || TEMP || '/tmp';
      return `${prefix.replace(/\/$/, '')}/discord-ipc-${id}`;
    }

    function getIPC(id = 0) {
      return new Promise((resolve, reject) => {
        const path = getIPCPath(id);
        const onerror = () => {
          if (id < 10) {
            resolve(getIPC(id + 1));
          } else {
            reject(new Error('Could not connect'));
          }
        };
        const sock = net.createConnection(path, () => {
          sock.removeListener('error', onerror);
          resolve(sock);
        });
        sock.once('error', onerror);
      });
    }

    async function findEndpoint(tries = 0) {
      if (tries > 30) {
        throw new Error('Could not find endpoint');
      }
      const endpoint = `http://127.0.0.1:${6463 + (tries % 10)}`;
      try {
        const r = await fetch$2(endpoint);
        if (r.status === 404) {
          return endpoint;
        }
        return findEndpoint(tries + 1);
      } catch (e) {
        return findEndpoint(tries + 1);
      }
    }

    function encode(op, data) {
      data = JSON.stringify(data);
      const len = Buffer.byteLength(data);
      const packet = Buffer.alloc(8 + len);
      packet.writeInt32LE(op, 0);
      packet.writeInt32LE(len, 4);
      packet.write(data, 8, len);
      return packet;
    }

    const working = {
      full: '',
      op: undefined,
    };

    function decode(socket, callback) {
      const packet = socket.read();
      if (!packet) {
        return;
      }

      let { op } = working;
      let raw;
      if (working.full === '') {
        op = working.op = packet.readInt32LE(0);
        const len = packet.readInt32LE(4);
        raw = packet.slice(8, len + 8);
      } else {
        raw = packet.toString();
      }

      try {
        const data = JSON.parse(working.full + raw);
        callback({ op, data }); // eslint-disable-line callback-return
        working.full = '';
        working.op = undefined;
      } catch (err) {
        working.full += raw;
      }

      decode(socket, callback);
    }

    class IPCTransport extends EventEmitter$2 {
      constructor(client) {
        super();
        this.client = client;
        this.socket = null;
      }

      async connect() {
        const socket = this.socket = await getIPC();
        socket.on('close', this.onClose.bind(this));
        socket.on('error', this.onClose.bind(this));
        this.emit('open');
        socket.write(encode(OPCodes.HANDSHAKE, {
          v: 1,
          client_id: this.client.clientId,
        }));
        socket.pause();
        socket.on('readable', () => {
          decode(socket, ({ op, data }) => {
            switch (op) {
              case OPCodes.PING:
                this.send(data, OPCodes.PONG);
                break;
              case OPCodes.FRAME:
                if (!data) {
                  return;
                }
                if (data.cmd === 'AUTHORIZE' && data.evt !== 'ERROR') {
                  findEndpoint()
                    .then((endpoint) => {
                      this.client.request.endpoint = endpoint;
                    })
                    .catch((e) => {
                      this.client.emit('error', e);
                    });
                }
                this.emit('message', data);
                break;
              case OPCodes.CLOSE:
                this.emit('close', data);
                break;
              default:
                break;
            }
          });
        });
      }

      onClose(e) {
        this.emit('close', e);
      }

      send(data, op = OPCodes.FRAME) {
        this.socket.write(encode(op, data));
      }

      async close() {
        return new Promise((r) => {
          this.once('close', r);
          this.send({}, OPCodes.CLOSE);
          this.socket.end();
        });
      }

      ping() {
        this.send(uuid$1(), OPCodes.PING);
      }
    }

    ipc.exports = IPCTransport;
    ipc.exports.encode = encode;
    ipc.exports.decode = decode;

    var constants = {};

    function keyMirror(arr) {
      const tmp = {};
      for (const value of arr) {
        tmp[value] = value;
      }
      return tmp;
    }


    constants.browser = typeof window !== 'undefined';

    constants.RPCCommands = keyMirror([
      'DISPATCH',
      'AUTHORIZE',
      'AUTHENTICATE',
      'GET_GUILD',
      'GET_GUILDS',
      'GET_CHANNEL',
      'GET_CHANNELS',
      'CREATE_CHANNEL_INVITE',
      'GET_RELATIONSHIPS',
      'GET_USER',
      'SUBSCRIBE',
      'UNSUBSCRIBE',
      'SET_USER_VOICE_SETTINGS',
      'SET_USER_VOICE_SETTINGS_2',
      'SELECT_VOICE_CHANNEL',
      'GET_SELECTED_VOICE_CHANNEL',
      'SELECT_TEXT_CHANNEL',
      'GET_VOICE_SETTINGS',
      'SET_VOICE_SETTINGS_2',
      'SET_VOICE_SETTINGS',
      'CAPTURE_SHORTCUT',
      'SET_ACTIVITY',
      'SEND_ACTIVITY_JOIN_INVITE',
      'CLOSE_ACTIVITY_JOIN_REQUEST',
      'ACTIVITY_INVITE_USER',
      'ACCEPT_ACTIVITY_INVITE',
      'INVITE_BROWSER',
      'DEEP_LINK',
      'CONNECTIONS_CALLBACK',
      'BRAINTREE_POPUP_BRIDGE_CALLBACK',
      'GIFT_CODE_BROWSER',
      'GUILD_TEMPLATE_BROWSER',
      'OVERLAY',
      'BROWSER_HANDOFF',
      'SET_CERTIFIED_DEVICES',
      'GET_IMAGE',
      'CREATE_LOBBY',
      'UPDATE_LOBBY',
      'DELETE_LOBBY',
      'UPDATE_LOBBY_MEMBER',
      'CONNECT_TO_LOBBY',
      'DISCONNECT_FROM_LOBBY',
      'SEND_TO_LOBBY',
      'SEARCH_LOBBIES',
      'CONNECT_TO_LOBBY_VOICE',
      'DISCONNECT_FROM_LOBBY_VOICE',
      'SET_OVERLAY_LOCKED',
      'OPEN_OVERLAY_ACTIVITY_INVITE',
      'OPEN_OVERLAY_GUILD_INVITE',
      'OPEN_OVERLAY_VOICE_SETTINGS',
      'VALIDATE_APPLICATION',
      'GET_ENTITLEMENT_TICKET',
      'GET_APPLICATION_TICKET',
      'START_PURCHASE',
      'GET_SKUS',
      'GET_ENTITLEMENTS',
      'GET_NETWORKING_CONFIG',
      'NETWORKING_SYSTEM_METRICS',
      'NETWORKING_PEER_METRICS',
      'NETWORKING_CREATE_TOKEN',
      'SET_USER_ACHIEVEMENT',
      'GET_USER_ACHIEVEMENTS',
    ]);

    constants.RPCEvents = keyMirror([
      'CURRENT_USER_UPDATE',
      'GUILD_STATUS',
      'GUILD_CREATE',
      'CHANNEL_CREATE',
      'RELATIONSHIP_UPDATE',
      'VOICE_CHANNEL_SELECT',
      'VOICE_STATE_CREATE',
      'VOICE_STATE_DELETE',
      'VOICE_STATE_UPDATE',
      'VOICE_SETTINGS_UPDATE',
      'VOICE_SETTINGS_UPDATE_2',
      'VOICE_CONNECTION_STATUS',
      'SPEAKING_START',
      'SPEAKING_STOP',
      'GAME_JOIN',
      'GAME_SPECTATE',
      'ACTIVITY_JOIN',
      'ACTIVITY_JOIN_REQUEST',
      'ACTIVITY_SPECTATE',
      'ACTIVITY_INVITE',
      'NOTIFICATION_CREATE',
      'MESSAGE_CREATE',
      'MESSAGE_UPDATE',
      'MESSAGE_DELETE',
      'LOBBY_DELETE',
      'LOBBY_UPDATE',
      'LOBBY_MEMBER_CONNECT',
      'LOBBY_MEMBER_DISCONNECT',
      'LOBBY_MEMBER_UPDATE',
      'LOBBY_MESSAGE',
      'CAPTURE_SHORTCUT_CHANGE',
      'OVERLAY',
      'OVERLAY_UPDATE',
      'ENTITLEMENT_CREATE',
      'ENTITLEMENT_DELETE',
      'USER_ACHIEVEMENT_UPDATE',
      'READY',
      'ERROR',
    ]);

    constants.RPCErrors = {
      CAPTURE_SHORTCUT_ALREADY_LISTENING: 5004,
      GET_GUILD_TIMED_OUT: 5002,
      INVALID_ACTIVITY_JOIN_REQUEST: 4012,
      INVALID_ACTIVITY_SECRET: 5005,
      INVALID_CHANNEL: 4005,
      INVALID_CLIENTID: 4007,
      INVALID_COMMAND: 4002,
      INVALID_ENTITLEMENT: 4015,
      INVALID_EVENT: 4004,
      INVALID_GIFT_CODE: 4016,
      INVALID_GUILD: 4003,
      INVALID_INVITE: 4011,
      INVALID_LOBBY: 4013,
      INVALID_LOBBY_SECRET: 4014,
      INVALID_ORIGIN: 4008,
      INVALID_PAYLOAD: 4000,
      INVALID_PERMISSIONS: 4006,
      INVALID_TOKEN: 4009,
      INVALID_USER: 4010,
      LOBBY_FULL: 5007,
      NO_ELIGIBLE_ACTIVITY: 5006,
      OAUTH2_ERROR: 5000,
      PURCHASE_CANCELED: 5008,
      PURCHASE_ERROR: 5009,
      RATE_LIMITED: 5011,
      SELECT_CHANNEL_TIMED_OUT: 5001,
      SELECT_VOICE_FORCE_REQUIRED: 5003,
      SERVICE_UNAVAILABLE: 1001,
      TRANSACTION_ABORTED: 1002,
      UNAUTHORIZED_FOR_ACHIEVEMENT: 5010,
      UNKNOWN_ERROR: 1000,
    };

    constants.RPCCloseCodes = {
      CLOSE_NORMAL: 1000,
      CLOSE_UNSUPPORTED: 1003,
      CLOSE_ABNORMAL: 1006,
      INVALID_CLIENTID: 4000,
      INVALID_ORIGIN: 4001,
      RATELIMITED: 4002,
      TOKEN_REVOKED: 4003,
      INVALID_VERSION: 4004,
      INVALID_ENCODING: 4005,
    };

    constants.LobbyTypes = {
      PRIVATE: 1,
      PUBLIC: 2,
    };

    constants.RelationshipTypes = {
      NONE: 0,
      FRIEND: 1,
      BLOCKED: 2,
      PENDING_INCOMING: 3,
      PENDING_OUTGOING: 4,
      IMPLICIT: 5,
    };

    const EventEmitter$1 = require$$0__default$1['default'];
    const { browser } = constants;

    // eslint-disable-next-line
    const WebSocket = browser ? window.WebSocket : require$$2;

    const pack = (d) => JSON.stringify(d);
    const unpack = (s) => JSON.parse(s);

    class WebSocketTransport extends EventEmitter$1 {
      constructor(client) {
        super();
        this.client = client;
        this.ws = null;
        this.tries = 0;
      }

      async connect() {
        const port = 6463 + (this.tries % 10);
        this.tries += 1;

        this.ws = new WebSocket(
          `ws://127.0.0.1:${port}/?v=1&client_id=${this.client.clientId}`,
          browser ? undefined : { origin: this.client.options.origin },
        );
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
      }

      onOpen() {
        this.emit('open');
      }

      onClose(event) {
        if (!event.wasClean) {
          return;
        }
        this.emit('close', event);
      }

      onError(event) {
        try {
          this.ws.close();
        } catch {} // eslint-disable-line no-empty

        if (this.tries > 20) {
          this.emit('error', event.error);
        } else {
          setTimeout(() => {
            this.connect();
          }, 250);
        }
      }

      onMessage(event) {
        this.emit('message', unpack(event.data));
      }

      send(data) {
        this.ws.send(pack(data));
      }

      ping() {} // eslint-disable-line no-empty-function

      close() {
        return new Promise((r) => {
          this.once('close', r);
          this.ws.close();
        });
      }
    }

    var websocket = WebSocketTransport;

    var transports$1 = {
      ipc: ipc.exports,
      websocket: websocket,
    };

    const EventEmitter = require$$0__default$1['default'];
    const { setTimeout: setTimeout$1, clearTimeout } = require$$1__default['default'];
    const fetch$1 = browser$1.exports;
    const transports = transports$1;
    const { RPCCommands, RPCEvents, RelationshipTypes } = constants;
    const { pid: getPid, uuid } = util$1;

    function subKey(event, args) {
      return `${event}${JSON.stringify(args)}`;
    }

    /**
     * @typedef {RPCClientOptions}
     * @extends {ClientOptions}
     * @prop {string} transport RPC transport. one of `ipc` or `websocket`
     */

    /**
     * The main hub for interacting with Discord RPC
     * @extends {BaseClient}
     */
    class RPCClient extends EventEmitter {
      /**
       * @param {RPCClientOptions} [options] Options for the client.
       * You must provide a transport
       */
      constructor(options = {}) {
        super();

        this.options = options;

        this.accessToken = null;
        this.clientId = null;

        /**
         * Application used in this client
         * @type {?ClientApplication}
         */
        this.application = null;

        /**
         * User used in this application
         * @type {?User}
         */
        this.user = null;

        const Transport = transports[options.transport];
        if (!Transport) {
          throw new TypeError('RPC_INVALID_TRANSPORT', options.transport);
        }

        this.fetch = (method, path, { data, query } = {}) =>
          fetch$1(`${this.fetch.endpoint}${path}${query ? new URLSearchParams(query) : ''}`, {
            method,
            body: data,
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }).then(async (r) => {
            const body = await r.json();
            if (!r.ok) {
              const e = new Error(r.status);
              e.body = body;
              throw e;
            }
            return body;
          });

        this.fetch.endpoint = 'https://discord.com/api';

        /**
         * Raw transport userd
         * @type {RPCTransport}
         * @private
         */
        this.transport = new Transport(this);
        this.transport.on('message', this._onRpcMessage.bind(this));

        /**
         * Map of nonces being expected from the transport
         * @type {Map}
         * @private
         */
        this._expecting = new Map();

        this._connectPromise = undefined;
      }

      /**
       * Search and connect to RPC
       */
      connect(clientId) {
        if (this._connectPromise) {
          return this._connectPromise;
        }
        this._connectPromise = new Promise((resolve, reject) => {
          this.clientId = clientId;
          const timeout = setTimeout$1(() => reject(new Error('RPC_CONNECTION_TIMEOUT')), 10e3);
          timeout.unref();
          this.once('connected', () => {
            clearTimeout(timeout);
            resolve(this);
          });
          this.transport.once('close', () => {
            this._expecting.forEach((e) => {
              e.reject(new Error('connection closed'));
            });
            this.emit('disconnected');
            reject(new Error('connection closed'));
          });
          this.transport.connect().catch(reject);
        });
        return this._connectPromise;
      }

      /**
       * @typedef {RPCLoginOptions}
       * @param {string} clientId Client ID
       * @param {string} [clientSecret] Client secret
       * @param {string} [accessToken] Access token
       * @param {string} [rpcToken] RPC token
       * @param {string} [tokenEndpoint] Token endpoint
       * @param {string[]} [scopes] Scopes to authorize with
       */

      /**
       * Performs authentication flow. Automatically calls Client#connect if needed.
       * @param {RPCLoginOptions} options Options for authentication.
       * At least one property must be provided to perform login.
       * @example client.login({ clientId: '1234567', clientSecret: 'abcdef123' });
       * @returns {Promise<RPCClient>}
       */
      async login(options = {}) {
        let { clientId, accessToken } = options;
        await this.connect(clientId);
        if (!options.scopes) {
          this.emit('ready');
          return this;
        }
        if (!accessToken) {
          accessToken = await this.authorize(options);
        }
        return this.authenticate(accessToken);
      }

      /**
       * Request
       * @param {string} cmd Command
       * @param {Object} [args={}] Arguments
       * @param {string} [evt] Event
       * @returns {Promise}
       * @private
       */
      request(cmd, args, evt) {
        return new Promise((resolve, reject) => {
          const nonce = uuid();
          this.transport.send({ cmd, args, evt, nonce });
          this._expecting.set(nonce, { resolve, reject });
        });
      }

      /**
       * Message handler
       * @param {Object} message message
       * @private
       */
      _onRpcMessage(message) {
        if (message.cmd === RPCCommands.DISPATCH && message.evt === RPCEvents.READY) {
          if (message.data.user) {
            this.user = message.data.user;
          }
          this.emit('connected');
        } else if (this._expecting.has(message.nonce)) {
          const { resolve, reject } = this._expecting.get(message.nonce);
          if (message.evt === 'ERROR') {
            const e = new Error(message.data.message);
            e.code = message.data.code;
            e.data = message.data;
            reject(e);
          } else {
            resolve(message.data);
          }
          this._expecting.delete(message.nonce);
        } else {
          this.emit(message.evt, message.data);
        }
      }

      /**
       * Authorize
       * @param {Object} options options
       * @returns {Promise}
       * @private
       */
      async authorize({ scopes, clientSecret, rpcToken, redirectUri, prompt } = {}) {
        if (clientSecret && rpcToken === true) {
          const body = await this.fetch('POST', '/oauth2/token/rpc', {
            data: new URLSearchParams({
              client_id: this.clientId,
              client_secret: clientSecret,
            }),
          });
          rpcToken = body.rpc_token;
        }

        const { code } = await this.request('AUTHORIZE', {
          scopes,
          client_id: this.clientId,
          prompt,
          rpc_token: rpcToken,
        });

        const response = await this.fetch('POST', '/oauth2/token', {
          data: new URLSearchParams({
            client_id: this.clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          }),
        });

        return response.access_token;
      }

      /**
       * Authenticate
       * @param {string} accessToken access token
       * @returns {Promise}
       * @private
       */
      authenticate(accessToken) {
        return this.request('AUTHENTICATE', { access_token: accessToken })
          .then(({ application, user }) => {
            this.accessToken = accessToken;
            this.application = application;
            this.user = user;
            this.emit('ready');
            return this;
          });
      }


      /**
       * Fetch a guild
       * @param {Snowflake} id Guild ID
       * @param {number} [timeout] Timeout request
       * @returns {Promise<Guild>}
       */
      getGuild(id, timeout) {
        return this.request(RPCCommands.GET_GUILD, { guild_id: id, timeout });
      }

      /**
       * Fetch all guilds
       * @param {number} [timeout] Timeout request
       * @returns {Promise<Collection<Snowflake, Guild>>}
       */
      getGuilds(timeout) {
        return this.request(RPCCommands.GET_GUILDS, { timeout });
      }

      /**
       * Get a channel
       * @param {Snowflake} id Channel ID
       * @param {number} [timeout] Timeout request
       * @returns {Promise<Channel>}
       */
      getChannel(id, timeout) {
        return this.request(RPCCommands.GET_CHANNEL, { channel_id: id, timeout });
      }

      /**
       * Get all channels
       * @param {Snowflake} [id] Guild ID
       * @param {number} [timeout] Timeout request
       * @returns {Promise<Collection<Snowflake, Channel>>}
       */
      async getChannels(id, timeout) {
        const { channels } = await this.request(RPCCommands.GET_CHANNELS, {
          timeout,
          guild_id: id,
        });
        return channels;
      }

      /**
       * @typedef {CertifiedDevice}
       * @prop {string} type One of `AUDIO_INPUT`, `AUDIO_OUTPUT`, `VIDEO_INPUT`
       * @prop {string} uuid This device's Windows UUID
       * @prop {object} vendor Vendor information
       * @prop {string} vendor.name Vendor's name
       * @prop {string} vendor.url Vendor's url
       * @prop {object} model Model information
       * @prop {string} model.name Model's name
       * @prop {string} model.url Model's url
       * @prop {string[]} related Array of related product's Windows UUIDs
       * @prop {boolean} echoCancellation If the device has echo cancellation
       * @prop {boolean} noiseSuppression If the device has noise suppression
       * @prop {boolean} automaticGainControl If the device has automatic gain control
       * @prop {boolean} hardwareMute If the device has a hardware mute
       */

      /**
       * Tell discord which devices are certified
       * @param {CertifiedDevice[]} devices Certified devices to send to discord
       * @returns {Promise}
       */
      setCertifiedDevices(devices) {
        return this.request(RPCCommands.SET_CERTIFIED_DEVICES, {
          devices: devices.map((d) => ({
            type: d.type,
            id: d.uuid,
            vendor: d.vendor,
            model: d.model,
            related: d.related,
            echo_cancellation: d.echoCancellation,
            noise_suppression: d.noiseSuppression,
            automatic_gain_control: d.automaticGainControl,
            hardware_mute: d.hardwareMute,
          })),
        });
      }

      /**
       * @typedef {UserVoiceSettings}
       * @prop {Snowflake} id ID of the user these settings apply to
       * @prop {?Object} [pan] Pan settings, an object with `left` and `right` set between
       * 0.0 and 1.0, inclusive
       * @prop {?number} [volume=100] The volume
       * @prop {bool} [mute] If the user is muted
       */

      /**
       * Set the voice settings for a user, by id
       * @param {Snowflake} id ID of the user to set
       * @param {UserVoiceSettings} settings Settings
       * @returns {Promise}
       */
      setUserVoiceSettings(id, settings) {
        return this.request(RPCCommands.SET_USER_VOICE_SETTINGS, {
          user_id: id,
          pan: settings.pan,
          mute: settings.mute,
          volume: settings.volume,
        });
      }

      /**
       * Move the user to a voice channel
       * @param {Snowflake} id ID of the voice channel
       * @param {Object} [options] Options
       * @param {number} [options.timeout] Timeout for the command
       * @param {boolean} [options.force] Force this move. This should only be done if you
       * have explicit permission from the user.
       * @returns {Promise}
       */
      selectVoiceChannel(id, { timeout, force = false } = {}) {
        return this.request(RPCCommands.SELECT_VOICE_CHANNEL, { channel_id: id, timeout, force });
      }

      /**
       * Move the user to a text channel
       * @param {Snowflake} id ID of the voice channel
       * @param {Object} [options] Options
       * @param {number} [options.timeout] Timeout for the command
       * have explicit permission from the user.
       * @returns {Promise}
       */
      selectTextChannel(id, { timeout } = {}) {
        return this.request(RPCCommands.SELECT_TEXT_CHANNEL, { channel_id: id, timeout });
      }

      /**
       * Get current voice settings
       * @returns {Promise}
       */
      getVoiceSettings() {
        return this.request(RPCCommands.GET_VOICE_SETTINGS)
          .then((s) => ({
            automaticGainControl: s.automatic_gain_control,
            echoCancellation: s.echo_cancellation,
            noiseSuppression: s.noise_suppression,
            qos: s.qos,
            silenceWarning: s.silence_warning,
            deaf: s.deaf,
            mute: s.mute,
            input: {
              availableDevices: s.input.available_devices,
              device: s.input.device_id,
              volume: s.input.volume,
            },
            output: {
              availableDevices: s.output.available_devices,
              device: s.output.device_id,
              volume: s.output.volume,
            },
            mode: {
              type: s.mode.type,
              autoThreshold: s.mode.auto_threshold,
              threshold: s.mode.threshold,
              shortcut: s.mode.shortcut,
              delay: s.mode.delay,
            },
          }));
      }

      /**
       * Set current voice settings, overriding the current settings until this session disconnects.
       * This also locks the settings for any other rpc sessions which may be connected.
       * @param {Object} args Settings
       * @returns {Promise}
       */
      setVoiceSettings(args) {
        return this.request(RPCCommands.SET_VOICE_SETTINGS, {
          automatic_gain_control: args.automaticGainControl,
          echo_cancellation: args.echoCancellation,
          noise_suppression: args.noiseSuppression,
          qos: args.qos,
          silence_warning: args.silenceWarning,
          deaf: args.deaf,
          mute: args.mute,
          input: args.input ? {
            device_id: args.input.device,
            volume: args.input.volume,
          } : undefined,
          output: args.output ? {
            device_id: args.output.device,
            volume: args.output.volume,
          } : undefined,
          mode: args.mode ? {
            type: args.mode.type,
            auto_threshold: args.mode.autoThreshold,
            threshold: args.mode.threshold,
            shortcut: args.mode.shortcut,
            delay: args.mode.delay,
          } : undefined,
        });
      }

      /**
       * Capture a shortcut using the client
       * The callback takes (key, stop) where `stop` is a function that will stop capturing.
       * This `stop` function must be called before disconnecting or else the user will have
       * to restart their client.
       * @param {Function} callback Callback handling keys
       * @returns {Promise<Function>}
       */
      captureShortcut(callback) {
        const subid = subKey(RPCEvents.CAPTURE_SHORTCUT_CHANGE);
        const stop = () => {
          this._subscriptions.delete(subid);
          return this.request(RPCCommands.CAPTURE_SHORTCUT, { action: 'STOP' });
        };
        this._subscriptions.set(subid, ({ shortcut }) => {
          callback(shortcut, stop);
        });
        return this.request(RPCCommands.CAPTURE_SHORTCUT, { action: 'START' })
          .then(() => stop);
      }

      /**
       * Sets the presence for the logged in user.
       * @param {object} args The rich presence to pass.
       * @param {number} [pid] The application's process ID. Defaults to the executing process' PID.
       * @returns {Promise}
       */
      setActivity(args = {}, pid = getPid()) {
        let timestamps;
        let assets;
        let party;
        let secrets;
        if (args.startTimestamp || args.endTimestamp) {
          timestamps = {
            start: args.startTimestamp,
            end: args.endTimestamp,
          };
          if (timestamps.start instanceof Date) {
            timestamps.start = Math.round(timestamps.start.getTime());
          }
          if (timestamps.end instanceof Date) {
            timestamps.end = Math.round(timestamps.end.getTime());
          }
          if (timestamps.start > 2147483647000) {
            throw new RangeError('timestamps.start must fit into a unix timestamp');
          }
          if (timestamps.end > 2147483647000) {
            throw new RangeError('timestamps.end must fit into a unix timestamp');
          }
        }
        if (
          args.largeImageKey || args.largeImageText
          || args.smallImageKey || args.smallImageText
        ) {
          assets = {
            large_image: args.largeImageKey,
            large_text: args.largeImageText,
            small_image: args.smallImageKey,
            small_text: args.smallImageText,
          };
        }
        if (args.partySize || args.partyId || args.partyMax) {
          party = { id: args.partyId };
          if (args.partySize || args.partyMax) {
            party.size = [args.partySize, args.partyMax];
          }
        }
        if (args.matchSecret || args.joinSecret || args.spectateSecret) {
          secrets = {
            match: args.matchSecret,
            join: args.joinSecret,
            spectate: args.spectateSecret,
          };
        }

        return this.request(RPCCommands.SET_ACTIVITY, {
          pid,
          activity: {
            state: args.state,
            details: args.details,
            timestamps,
            assets,
            party,
            secrets,
            buttons: args.buttons,
            instance: !!args.instance,
          },
        });
      }

      /**
       * Clears the currently set presence, if any. This will hide the "Playing X" message
       * displayed below the user's name.
       * @param {number} [pid] The application's process ID. Defaults to the executing process' PID.
       * @returns {Promise}
       */
      clearActivity(pid = getPid()) {
        return this.request(RPCCommands.SET_ACTIVITY, {
          pid,
        });
      }

      /**
       * Invite a user to join the game the RPC user is currently playing
       * @param {User} user The user to invite
       * @returns {Promise}
       */
      sendJoinInvite(user) {
        return this.request(RPCCommands.SEND_ACTIVITY_JOIN_INVITE, {
          user_id: user.id || user,
        });
      }

      /**
       * Request to join the game the user is playing
       * @param {User} user The user whose game you want to request to join
       * @returns {Promise}
       */
      sendJoinRequest(user) {
        return this.request(RPCCommands.SEND_ACTIVITY_JOIN_REQUEST, {
          user_id: user.id || user,
        });
      }

      /**
       * Reject a join request from a user
       * @param {User} user The user whose request you wish to reject
       * @returns {Promise}
       */
      closeJoinRequest(user) {
        return this.request(RPCCommands.CLOSE_ACTIVITY_JOIN_REQUEST, {
          user_id: user.id || user,
        });
      }

      createLobby(type, capacity, metadata) {
        return this.request(RPCCommands.CREATE_LOBBY, {
          type,
          capacity,
          metadata,
        });
      }

      updateLobby(lobby, { type, owner, capacity, metadata } = {}) {
        return this.request(RPCCommands.UPDATE_LOBBY, {
          id: lobby.id || lobby,
          type,
          owner_id: (owner && owner.id) || owner,
          capacity,
          metadata,
        });
      }

      deleteLobby(lobby) {
        return this.request(RPCCommands.DELETE_LOBBY, {
          id: lobby.id || lobby,
        });
      }

      connectToLobby(id, secret) {
        return this.request(RPCCommands.CONNECT_TO_LOBBY, {
          id,
          secret,
        });
      }

      sendToLobby(lobby, data) {
        return this.request(RPCCommands.SEND_TO_LOBBY, {
          id: lobby.id || lobby,
          data,
        });
      }

      disconnectFromLobby(lobby) {
        return this.request(RPCCommands.DISCONNECT_FROM_LOBBY, {
          id: lobby.id || lobby,
        });
      }

      updateLobbyMember(lobby, user, metadata) {
        return this.request(RPCCommands.UPDATE_LOBBY_MEMBER, {
          lobby_id: lobby.id || lobby,
          user_id: user.id || user,
          metadata,
        });
      }

      getRelationships() {
        const types = Object.keys(RelationshipTypes);
        return this.request(RPCCommands.GET_RELATIONSHIPS)
          .then((o) => o.relationships.map((r) => ({
            ...r,
            type: types[r.type],
          })));
      }

      /**
       * Subscribe to an event
       * @param {string} event Name of event e.g. `MESSAGE_CREATE`
       * @param {Object} [args] Args for event e.g. `{ channel_id: '1234' }`
       * @returns {Promise<Object>}
       */
      async subscribe(event, args) {
        await this.request(RPCCommands.SUBSCRIBE, args, event);
        return {
          unsubscribe: () => this.request(RPCCommands.UNSUBSCRIBE, args, event),
        };
      }

      /**
       * Destroy the client
       */
      async destroy() {
        await this.transport.close();
      }
    }

    var client = RPCClient;

    const util = util$1;

    var src = {
      Client: client,
      register(id) {
        return util.register(`discord-${id}`);
      },
    };

    /* src/frontend/components/ConnectServer.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file$1 = "src/frontend/components/ConnectServer.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "test";
    			add_location(div, file$1, 81, 0, 2778);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const clientId = "280984871685062656";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ConnectServer", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let mainWindow;

    	function createWindow() {
    		mainWindow = new electron.BrowserWindow({
    				width: 340,
    				height: 380,
    				resizable: false,
    				titleBarStyle: "hidden",
    				webPreferences: { nodeIntegration: true }
    			});

    		mainWindow.loadURL(url__default['default'].format({
    			pathname: path__default['default'].join(__dirname, "index.html"),
    			protocol: "file:",
    			slashes: true
    		}));

    		mainWindow.on("closed", () => {
    			mainWindow = null;
    		});
    	}

    	electron.app.on("ready", createWindow);

    	electron.app.on("window-all-closed", () => {
    		electron.app.quit();
    	});

    	electron.app.on("activate", () => {
    		if (mainWindow === null) {
    			createWindow();
    		}
    	});

    	// Only needed if you want to use spectate, join, or ask to join
    	src.register(clientId);

    	const rpc = new src.Client({ transport: "ipc" });
    	const startTimestamp = new Date();

    	function setActivity() {
    		return __awaiter(this, void 0, void 0, function* () {
    			if (!rpc || !mainWindow) {
    				return;
    			}

    			const boops = yield mainWindow.webContents.executeJavaScript("window.boops");

    			// You'll need to have snek_large and snek_small assets uploaded to
    			// https://discord.com/developers/applications/<application_id>/rich-presence/assets
    			rpc.setActivity({
    				details: `booped ${boops} times`,
    				state: "in slither party",
    				startTimestamp,
    				largeImageKey: "snek_large",
    				largeImageText: "tea is delicious",
    				smallImageKey: "snek_small",
    				smallImageText: "i am my own pillows",
    				instance: false
    			});
    		});
    	}

    	rpc.on("ready", () => {
    		setActivity();

    		// activity can only be set every 15 seconds
    		setInterval(
    			() => {
    				setActivity();
    			},
    			15000
    		);
    	});

    	rpc.login({ clientId }).catch(console.error);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ConnectServer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__awaiter,
    		app: electron.app,
    		BrowserWindow: electron.BrowserWindow,
    		path: path__default['default'],
    		url: url__default['default'],
    		DiscordRPC: src,
    		mainWindow,
    		createWindow,
    		clientId,
    		rpc,
    		startTimestamp,
    		setActivity
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("mainWindow" in $$props) mainWindow = $$props.mainWindow;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class ConnectServer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConnectServer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/frontend/App.svelte generated by Svelte v3.38.2 */
    const file = "src/frontend/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (44:0) {#each servers as server}
    function create_each_block(ctx) {
    	let div;
    	let t_value = /*server*/ ctx[3].ip + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file, 44, 0, 1482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*servers*/ 1 && t_value !== (t_value = /*server*/ ctx[3].ip + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(44:0) {#each servers as server}",
    		ctx
    	});

    	return block;
    }

    // (53:2) <Route path="/">
    function create_default_slot_1(ctx) {
    	let serverlist;
    	let current;
    	serverlist = new ServerList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(serverlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(serverlist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(serverlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(serverlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(serverlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(53:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (51:0) <Router url="">
    function create_default_slot(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: { path: "options", component: Options },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(51:0) <Router url=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let nord;
    	let t0;
    	let header;
    	let t1;
    	let t2;
    	let connectserver;
    	let t3;
    	let router;
    	let current;
    	nord = new Nord({ $$inline: true });
    	header = new Header({ $$inline: true });
    	let each_value = /*servers*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	connectserver = new ConnectServer({ $$inline: true });

    	router = new Router({
    			props: {
    				url: "",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nord.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(connectserver.$$.fragment);
    			t3 = space();
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(nord, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(header, target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(connectserver, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*servers*/ 1) {
    				each_value = /*servers*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const router_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nord.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(connectserver.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nord.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(connectserver.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nord, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(connectserver, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let servers = [];

    	let func = function () {
    		return __awaiter(this, void 0, void 0, function* () {
    			$$invalidate(0, servers = yield SampApi.GetAllServersList());
    		});
    	};

    	func();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__awaiter,
    		Router,
    		Route,
    		Nord,
    		ServerList,
    		Options,
    		Header,
    		SampApi,
    		ServerInfo,
    		ConnectServer,
    		servers,
    		func
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("servers" in $$props) $$invalidate(0, servers = $$props.servers);
    		if ("func" in $$props) func = $$props.func;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [servers];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        /*props: {
          name: "world"
        },*/
    });

    return app;

}(require$$0, path$1, url, require$$0$1, require$$1));
//# sourceMappingURL=bundle.js.map
