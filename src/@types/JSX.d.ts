// tslint:disable:interface-name no-reserved-keywords

declare global {
	namespace JSX {
		interface Element {
			type: string;
			attributes: {[key: string]: string};
			children: Element[];
		}
		interface ElementClass {
			render(): void;
		}

		interface IntrinsicElements {
			// HTML
			a: HTMLProps<HTMLAnchorElement>;
			abbr: HTMLProps<HTMLElement>;
			address: HTMLProps<HTMLElement>;
			area: HTMLProps<HTMLAreaElement>;
			article: HTMLProps<HTMLElement>;
			aside: HTMLProps<HTMLElement>;
			audio: HTMLProps<HTMLAudioElement>;
			b: HTMLProps<HTMLElement>;
			base: HTMLProps<HTMLBaseElement>;
			bdi: HTMLProps<HTMLElement>;
			bdo: HTMLProps<HTMLElement>;
			big: HTMLProps<HTMLElement>;
			blockquote: HTMLProps<HTMLElement>;
			body: HTMLProps<HTMLBodyElement>;
			br: HTMLProps<HTMLBRElement>;
			button: HTMLProps<HTMLButtonElement>;
			canvas: HTMLProps<HTMLCanvasElement>;
			caption: HTMLProps<HTMLElement>;
			cite: HTMLProps<HTMLElement>;
			code: HTMLProps<HTMLElement>;
			col: HTMLProps<HTMLTableColElement>;
			colgroup: HTMLProps<HTMLTableColElement>;
			data: HTMLProps<HTMLElement>;
			datalist: HTMLProps<HTMLDataListElement>;
			dd: HTMLProps<HTMLElement>;
			del: HTMLProps<HTMLElement>;
			details: HTMLProps<HTMLElement>;
			dfn: HTMLProps<HTMLElement>;
			dialog: HTMLProps<HTMLElement>;
			div: HTMLProps<HTMLDivElement>;
			dl: HTMLProps<HTMLDListElement>;
			dt: HTMLProps<HTMLElement>;
			em: HTMLProps<HTMLElement>;
			embed: HTMLProps<HTMLEmbedElement>;
			fieldset: HTMLProps<HTMLFieldSetElement>;
			figcaption: HTMLProps<HTMLElement>;
			figure: HTMLProps<HTMLElement>;
			footer: HTMLProps<HTMLElement>;
			form: HTMLProps<HTMLFormElement>;
			h1: HTMLProps<HTMLHeadingElement>;
			h2: HTMLProps<HTMLHeadingElement>;
			h3: HTMLProps<HTMLHeadingElement>;
			h4: HTMLProps<HTMLHeadingElement>;
			h5: HTMLProps<HTMLHeadingElement>;
			h6: HTMLProps<HTMLHeadingElement>;
			head: HTMLProps<HTMLHeadElement>;
			header: HTMLProps<HTMLElement>;
			hgroup: HTMLProps<HTMLElement>;
			hr: HTMLProps<HTMLHRElement>;
			html: HTMLProps<HTMLHtmlElement>;
			i: HTMLProps<HTMLElement>;
			iframe: HTMLProps<HTMLIFrameElement>;
			img: HTMLProps<HTMLImageElement>;
			input: HTMLProps<HTMLInputElement>;
			ins: HTMLProps<HTMLModElement>;
			kbd: HTMLProps<HTMLElement>;
			keygen: HTMLProps<HTMLElement>;
			label: HTMLProps<HTMLLabelElement>;
			legend: HTMLProps<HTMLLegendElement>;
			li: HTMLProps<HTMLLIElement>;
			link: HTMLProps<HTMLLinkElement>;
			main: HTMLProps<HTMLElement>;
			map: HTMLProps<HTMLMapElement>;
			mark: HTMLProps<HTMLElement>;
			menu: HTMLProps<HTMLElement>;
			menuitem: HTMLProps<HTMLElement>;
			meta: HTMLProps<HTMLMetaElement>;
			meter: HTMLProps<HTMLElement>;
			nav: HTMLProps<HTMLElement>;
			noscript: HTMLProps<HTMLElement>;
			object: HTMLProps<HTMLObjectElement>;
			ol: HTMLProps<HTMLOListElement>;
			optgroup: HTMLProps<HTMLOptGroupElement>;
			option: HTMLProps<HTMLOptionElement>;
			output: HTMLProps<HTMLElement>;
			p: HTMLProps<HTMLParagraphElement>;
			param: HTMLProps<HTMLParamElement>;
			picture: HTMLProps<HTMLElement>;
			pre: HTMLProps<HTMLPreElement>;
			progress: HTMLProps<HTMLProgressElement>;
			q: HTMLProps<HTMLQuoteElement>;
			rp: HTMLProps<HTMLElement>;
			rt: HTMLProps<HTMLElement>;
			ruby: HTMLProps<HTMLElement>;
			s: HTMLProps<HTMLElement>;
			samp: HTMLProps<HTMLElement>;
			script: HTMLProps<HTMLElement>;
			section: HTMLProps<HTMLElement>;
			select: HTMLProps<HTMLSelectElement>;
			small: HTMLProps<HTMLElement>;
			source: HTMLProps<HTMLSourceElement>;
			span: HTMLProps<HTMLSpanElement>;
			strong: HTMLProps<HTMLElement>;
			style: HTMLProps<HTMLStyleElement>;
			sub: HTMLProps<HTMLElement>;
			summary: HTMLProps<HTMLElement>;
			sup: HTMLProps<HTMLElement>;
			table: HTMLProps<HTMLTableElement>;
			tbody: HTMLProps<HTMLTableSectionElement>;
			td: HTMLProps<HTMLTableDataCellElement>;
			textarea: HTMLProps<HTMLTextAreaElement>;
			tfoot: HTMLProps<HTMLTableSectionElement>;
			th: HTMLProps<HTMLTableHeaderCellElement>;
			thead: HTMLProps<HTMLTableSectionElement>;
			time: HTMLProps<HTMLElement>;
			title: HTMLProps<HTMLTitleElement>;
			tr: HTMLProps<HTMLTableRowElement>;
			track: HTMLProps<HTMLTrackElement>;
			u: HTMLProps<HTMLElement>;
			ul: HTMLProps<HTMLUListElement>;
			'var': HTMLProps<HTMLElement>;
			video: HTMLProps<HTMLVideoElement>;
			wbr: HTMLProps<HTMLElement>;

			// SVG
			svg: SVGProps;

			circle: SVGProps;
			clipPath: SVGProps;
			defs: SVGProps;
			desc: SVGProps;
			ellipse: SVGProps;
			feBlend: SVGProps;
			feColorMatrix: SVGProps;
			feComponentTransfer: SVGProps;
			feComposite: SVGProps;
			feConvolveMatrix: SVGProps;
			feDiffuseLighting: SVGProps;
			feDisplacementMap: SVGProps;
			feDistantLight: SVGProps;
			feFlood: SVGProps;
			feFuncA: SVGProps;
			feFuncB: SVGProps;
			feFuncG: SVGProps;
			feFuncR: SVGProps;
			feGaussianBlur: SVGProps;
			feImage: SVGProps;
			feMerge: SVGProps;
			feMergeNode: SVGProps;
			feMorphology: SVGProps;
			feOffset: SVGProps;
			fePointLight: SVGProps;
			feSpecularLighting: SVGProps;
			feSpotLight: SVGProps;
			feTile: SVGProps;
			feTurbulence: SVGProps;
			filter: SVGProps;
			foreignObject: SVGProps;
			g: SVGProps;
			image: SVGProps;
			line: SVGProps;
			linearGradient: SVGProps;
			marker: SVGProps;
			mask: SVGProps;
			metadata: SVGProps;
			path: SVGProps;
			pattern: SVGProps;
			polygon: SVGProps;
			polyline: SVGProps;
			radialGradient: SVGProps;
			rect: SVGProps;
			stop: SVGProps;
			switch: SVGProps;
			symbol: SVGProps;
			text: SVGProps;
			textPath: SVGProps;
			tspan: SVGProps;
			use: SVGProps;
			view: SVGProps;
		}
	}


	namespace CSS {
		interface CSSProperties {
			alignContent?: any;
			alignItems?: any;
			alignSelf?: any;
			alignmentAdjust?: any;
			alignmentBaseline?: any;
			animationDelay?: any;
			animationDirection?: any;
			animationIterationCount?: any;
			animationName?: any;
			animationPlayState?: any;
			appearance?: any;
			backfaceVisibility?: any;
			background?: any;
			backgroundAttachment?: 'scroll' | 'fixed' | 'local';
			backgroundBlendMode?: any;
			backgroundColor?: any;
			backgroundComposite?: any;
			backgroundImage?: any;
			backgroundOrigin?: any;
			backgroundPosition?: any;
			backgroundRepeat?: any;
			baselineShift?: any;
			behavior?: any;
			border?: any;
			borderBottom?: any;
			borderBottomColor?: any;
			borderBottomLeftRadius?: any;
			borderBottomRightRadius?: any;
			borderBottomStyle?: any;
			borderBottomWidth?: any;
			borderCollapse?: any;
			borderColor?: any;
			borderCornerShape?: any;
			borderImageSource?: any;
			borderImageWidth?: any;
			borderLeft?: any;
			borderLeftColor?: any;
			borderLeftStyle?: any;
			borderLeftWidth?: any;
			borderRight?: any;
			borderRightColor?: any;
			borderRightStyle?: any;
			borderRightWidth?: any;
			borderSpacing?: any;
			borderStyle?: any;
			borderTop?: any;
			borderTopColor?: any;
			borderTopLeftRadius?: any;
			borderTopRightRadius?: any;
			borderTopStyle?: any;
			borderTopWidth?: any;
			borderWidth?: any;
			bottom?: any;
			boxAlign?: any;
			boxDecorationBreak?: any;
			boxDirection?: any;
			boxLineProgression?: any;
			boxLines?: any;
			boxOrdinalGroup?: any;
			boxFlex?: number;
			boxFlexGroup?: number;
			breakAfter?: any;
			breakBefore?: any;
			breakInside?: any;
			clear?: any;
			clip?: any;
			clipRule?: any;
			color?: any;
			columnCount?: number;
			columnFill?: any;
			columnGap?: any;
			columnRule?: any;
			columnRuleColor?: any;
			columnRuleWidth?: any;
			columnSpan?: any;
			columnWidth?: any;
			columns?: any;
			counterIncrement?: any;
			counterReset?: any;
			cue?: any;
			cueAfter?: any;
			cursor?: any;
			direction?: any;
			display?: any;
			fill?: any;
			fillOpacity?: number;
			fillRule?: any;
			filter?: any;
			flex?: number | string;
			flexAlign?: any;
			flexBasis?: any;
			flexDirection?: any;
			flexFlow?: any;
			flexGrow?: number;
			flexItemAlign?: any;
			flexLinePack?: any;
			flexOrder?: any;
			flexShrink?: number;
			float?: any;
			flowFrom?: any;
			font?: any;
			fontFamily?: any;
			fontKerning?: any;
			fontSize?: number | string;
			fontSizeAdjust?: any;
			fontStretch?: any;
			fontStyle?: any;
			fontSynthesis?: any;
			fontVariant?: any;
			fontVariantAlternates?: any;
			fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number;
			gridArea?: any;
			gridColumn?: any;
			gridColumnEnd?: any;
			gridColumnStart?: any;
			gridRow?: any;
			gridRowEnd?: any;
			gridRowPosition?: any;
			gridRowSpan?: any;
			gridTemplateAreas?: any;
			gridTemplateColumns?: any;
			gridTemplateRows?: any;
			height?: any;
			hyphenateLimitChars?: any;
			hyphenateLimitLines?: any;
			hyphenateLimitZone?: any;
			hyphens?: any;
			imeMode?: any;
			layoutGrid?: any;
			layoutGridChar?: any;
			layoutGridLine?: any;
			layoutGridMode?: any;
			layoutGridType?: any;
			left?: any;
			letterSpacing?: any;
			lineBreak?: any;
			lineClamp?: number;
			lineHeight?: number | string;
			listStyle?: any;
			listStyleImage?: any;
			listStylePosition?: any;
			listStyleType?: any;
			margin?: any;
			marginBottom?: any;
			marginLeft?: any;
			marginRight?: any;
			marginTop?: any;
			marqueeDirection?: any;
			marqueeStyle?: any;
			mask?: any;
			maskBorder?: any;
			maskBorderRepeat?: any;
			maskBorderSlice?: any;
			maskBorderSource?: any;
			maskBorderWidth?: any;
			maskClip?: any;
			maskOrigin?: any;
			maxFontSize?: any;
			maxHeight?: any;
			maxWidth?: any;
			minHeight?: any;
			minWidth?: any;
			opacity?: number;
			order?: number;
			orphans?: number;
			outline?: any;
			outlineColor?: any;
			outlineOffset?: any;
			overflow?: any;
			overflowStyle?: any;
			overflowX?: any;
			overflowY?: any;
			padding?: any;
			paddingBottom?: any;
			paddingLeft?: any;
			paddingRight?: any;
			paddingTop?: any;
			pageBreakAfter?: any;
			pageBreakBefore?: any;
			pageBreakInside?: any;
			pause?: any;
			pauseAfter?: any;
			pauseBefore?: any;
			perspective?: any;
			perspectiveOrigin?: any;
			pointerEvents?: any;
			position?: any;
			punctuationTrim?: any;
			quotes?: any;
			regionFragment?: any;
			restAfter?: any;
			restBefore?: any;
			right?: any;
			rubyAlign?: any;
			rubyPosition?: any;
			shapeImageThreshold?: any;
			shapeInside?: any;
			shapeMargin?: any;
			shapeOutside?: any;
			speak?: any;
			speakAs?: any;
			strokeOpacity?: number;
			strokeWidth?: number;
			tabSize?: any;
			tableLayout?: any;
			textAlign?: any;
			textAlignLast?: any;
			textDecoration?: any;
			textDecorationColor?: any;
			textDecorationLine?: any;
			textDecorationLineThrough?: any;
			textDecorationNone?: any;
			textDecorationOverline?: any;
			textDecorationSkip?: any;
			textDecorationStyle?: any;
			textDecorationUnderline?: any;
			textEmphasis?: any;
			textEmphasisColor?: any;
			textEmphasisStyle?: any;
			textHeight?: any;
			textIndent?: any;
			textJustifyTrim?: any;
			textKashidaSpace?: any;
			textLineThrough?: any;
			textLineThroughColor?: any;
			textLineThroughMode?: any;
			textLineThroughStyle?: any;
			textLineThroughWidth?: any;
			textOverflow?: any;
			textOverline?: any;
			textOverlineColor?: any;
			textOverlineMode?: any;
			textOverlineStyle?: any;
			textOverlineWidth?: any;
			textRendering?: any;
			textScript?: any;
			textShadow?: any;
			textTransform?: any;
			textUnderlinePosition?: any;
			textUnderlineStyle?: any;
			top?: any;
			touchAction?: any;
			transform?: any;
			transformOrigin?: any;
			transformOriginZ?: any;
			transformStyle?: any;
			transition?: any;
			transitionDelay?: any;
			transitionDuration?: any;
			transitionProperty?: any;
			transitionTimingFunction?: any;
			unicodeBidi?: any;
			unicodeRange?: any;
			userFocus?: any;
			userInput?: any;
			verticalAlign?: any;
			visibility?: any;
			voiceBalance?: any;
			voiceDuration?: any;
			voiceFamily?: any;
			voicePitch?: any;
			voiceRange?: any;
			voiceRate?: any;
			voiceStress?: any;
			voiceVolume?: any;
			whiteSpace?: any;
			whiteSpaceTreatment?: any;
			widows?: number;
			width?: any;
			wordBreak?: any;
			wordSpacing?: any;
			wordWrap?: any;
			wrapFlow?: any;
			wrapMargin?: any;
			wrapOption?: any;
			writingMode?: any;
			zIndex?: 'auto' | number;
			zoom?: 'auto' | number;
			[propertyName: string]: any;
		}
	}
}

interface DomNativeEvents {
	ondeactivate?(this: HTMLElement, ev: UIEvent): any;
	onbeforedeactivate?(this: HTMLElement, ev: UIEvent): any;
	onactivate?(this: HTMLElement, ev: UIEvent): any;
	onbeforeactivate?(this: HTMLElement, ev: UIEvent): any;
	oncuechange?(this: HTMLElement, ev: Event): any;
	onmscontentzoom?(this: HTMLElement, ev: UIEvent): any;
	onmsmanipulationstatechanged?(this: HTMLElement, ev: MSManipulationEvent): any;
	onclick?(this: HTMLElement, ev: MouseEvent): any;
	oncontextmenu?(this: HTMLElement, ev: PointerEvent): any;
	ondblclick?(this: HTMLElement, ev: MouseEvent): any;
	onmousedown?(this: HTMLElement, ev: MouseEvent): any;
	onmouseenter?(this: HTMLElement, ev: MouseEvent): any;
	onmouseleave?(this: HTMLElement, ev: MouseEvent): any;
	onmousemove?(this: HTMLElement, ev: MouseEvent): any;
	onmouseover?(this: HTMLElement, ev: MouseEvent): any;
	onmouseout?(this: HTMLElement, ev: MouseEvent): any;
	onmouseup?(this: HTMLElement, ev: MouseEvent): any;
	onkeydown?(this: HTMLElement, ev: KeyboardEvent): any;
	onkeypress?(this: HTMLElement, ev: KeyboardEvent): any;
	onkeyup?(this: HTMLElement, ev: KeyboardEvent): any;
	onabort?(this: HTMLElement, ev: UIEvent): any;
	onbeforeunload?(this: HTMLElement, ev: Event): any;
	onhashchange?(this: HTMLElement, ev: Event): any;
	onload?(this: HTMLElement, ev: Event): any;
	onpageshow?(this: HTMLElement, ev: Event): any;
	onpagehide?(this: HTMLElement, ev: Event): any;
	onresize?(this: HTMLElement, ev: Event): any;
	onscroll?(this: HTMLElement, ev: UIEvent): any;
	onunload?(this: HTMLElement, ev: Event): any;
	onblur?(this: HTMLElement, ev: FocusEvent): any;
	onchange?(this: HTMLElement, ev: Event): any;
	onfocus?(this: HTMLElement, ev: FocusEvent): any;
	onfocusin?(this: HTMLElement, ev: Event): any;
	onfocusout?(this: HTMLElement, ev: Event): any;
	oninput?(this: HTMLElement, ev: Event): any;
	oninvalid?(this: HTMLElement, ev: Event): any;
	onreset?(this: HTMLElement, ev: Event): any;
	onsearch?(this: HTMLElement, ev: Event): any;
	onselect?(this: HTMLElement, ev: UIEvent): any;
	onselectstart?(this: HTMLElement, ev: Event): any;
	onsubmit?(this: HTMLElement, ev: Event): any;
	ondrag?(this: HTMLElement, ev: DragEvent): any;
	ondragend?(this: HTMLElement, ev: DragEvent): any;
	ondragenter?(this: HTMLElement, ev: DragEvent): any;
	ondragleave?(this: HTMLElement, ev: DragEvent): any;
	ondragover?(this: HTMLElement, ev: DragEvent): any;
	ondragstart?(this: HTMLElement, ev: DragEvent): any;
	ondrop?(this: HTMLElement, ev: DragEvent): any;
	oncopy?(this: HTMLElement, ev: ClipboardEvent): any;
	onbeforecopy?(this: HTMLElement, ev: ClipboardEvent): any;
	oncut?(this: HTMLElement, ev: ClipboardEvent): any;
	onbeforecut?(this: HTMLElement, ev: ClipboardEvent): any;
	onpaste?(this: HTMLElement, ev: ClipboardEvent): any;
	onbeforepaste?(this: HTMLElement, ev: ClipboardEvent): any;
	onafterprint?(this: HTMLElement, ev: Event): any;
	onbeforeprint?(this: HTMLElement, ev: Event): any;
	oncanplay?(this: HTMLElement, ev: Event): any;
	oncanplaythrough?(this: HTMLElement, ev: Event): any;
	ondurationchange?(this: HTMLElement, ev: Event): any;
	onemptied?(this: HTMLElement, ev: Event): any;
	onended?(this: HTMLElement, ev: MediaStreamErrorEvent): any;
	onloadeddata?(this: HTMLElement, ev: Event): any;
	onloadedmetadata?(this: HTMLElement, ev: Event): any;
	onloadstart?(this: HTMLElement, ev: Event): any;
	onpause?(this: HTMLElement, ev: Event): any;
	onplay?(this: HTMLElement, ev: Event): any;
	onplaying?(this: HTMLElement, ev: Event): any;
	onprogress?(this: HTMLElement, ev: ProgressEvent): any;
	onratechange?(this: HTMLElement, ev: Event): any;
	onseeked?(this: HTMLElement, ev: Event): any;
	onseeking?(this: HTMLElement, ev: Event): any;
	onstalled?(this: HTMLElement, ev: Event): any;
	onsuspend?(this: HTMLElement, ev: Event): any;
	ontimeupdate?(this: HTMLElement, ev: Event): any;
	onvolumechange?(this: HTMLElement, ev: Event): any;
	onwaiting?(this: HTMLElement, ev: Event): any;
	animationend?(this: HTMLElement, ev: Event): any;
	animationiteration?(this: HTMLElement, ev: Event): any;
	animationstart?(this: HTMLElement, ev: Event): any;
	transitionend?(this: HTMLElement, ev: Event): any;
	onerror?(this: HTMLElement, ev: ErrorEvent): any;
	onopen?(this: HTMLElement, ev: Event): any;
	onmessage?(this: HTMLElement, ev: Event): any;
	onmousewheel?(this: HTMLElement, ev: WheelEvent): any;
	ononline?(this: HTMLElement, ev: Event): any;
	onoffline?(this: HTMLElement, ev: Event): any;
	onpopstate?(this: HTMLElement, ev: Event): any;
	onshow?(this: HTMLElement, ev: Event): any;
	onstorage?(this: HTMLElement, ev: Event): any;
	ontoggle?(this: HTMLElement, ev: Event): any;
	onwheel?(this: HTMLElement, ev: Event): any;
	ontouchcancel?(this: HTMLElement, ev: Event): any;
	ontouchend?(this: HTMLElement, ev: Event): any;
	ontouchmove?(this: HTMLElement, ev: Event): any;
	ontouchstart?(this: HTMLElement, ev: Event): any;
}

interface HTMLAttributes extends DomNativeEvents {
	// Standard HTML Attributes
	accept?: string;
	acceptCharset?: string;
	accessKey?: string;
	action?: string;
	allowFullScreen?: boolean;
	allowTransparency?: boolean;
	alt?: string;
	async?: boolean;
	autoComplete?: string;
	autoFocus?: boolean;
	autoPlay?: boolean;
	capture?: boolean;
	cellPadding?: number | string;
	cellSpacing?: number | string;
	charSet?: string;
	challenge?: string;
	checked?: boolean;
	classID?: string;
	className?: string;
	cols?: number;
	colSpan?: number;
	content?: string;
	contentEditable?: boolean;
	contextMenu?: string;
	controls?: boolean;
	coords?: string;
	crossOrigin?: string;
	data?: string;
	dateTime?: string;
	default?: boolean;
	defer?: boolean;
	dir?: string;
	disabled?: boolean;
	download?: any;
	draggable?: boolean;
	encType?: string;
	form?: string;
	formAction?: string;
	formEncType?: string;
	formMethod?: string;
	formNoValidate?: boolean;
	formTarget?: string;
	frameBorder?: number | string;
	headers?: string;
	height?: number | string;
	hidden?: boolean;
	high?: number;
	href?: string;
	hrefLang?: string;
	htmlFor?: string;
	httpEquiv?: string;
	icon?: string;
	id?: string;
	inputMode?: string;
	integrity?: string;
	is?: string;
	keyParams?: string;
	keyType?: string;
	kind?: string;
	label?: string;
	lang?: string;
	list?: string;
	loop?: boolean;
	low?: number;
	manifest?: string;
	marginHeight?: number;
	marginWidth?: number;
	max?: number | string;
	maxLength?: number;
	media?: string;
	mediaGroup?: string;
	method?: string;
	min?: number | string;
	minLength?: number;
	multiple?: boolean;
	muted?: boolean;
	name?: string;
	nonce?: string;
	noValidate?: boolean;
	open?: boolean;
	optimum?: number;
	pattern?: string;
	placeholder?: string;
	poster?: string;
	preload?: string;
	radioGroup?: string;
	readOnly?: boolean;
	rel?: string;
	required?: boolean;
	reversed?: boolean;
	role?: string;
	rows?: number;
	rowSpan?: number;
	sandbox?: string;
	scope?: string;
	scoped?: boolean;
	scrolling?: string;
	seamless?: boolean;
	selected?: boolean;
	shape?: string;
	size?: number;
	sizes?: string;
	span?: number;
	spellCheck?: boolean;
	src?: string;
	srcDoc?: string;
	srcLang?: string;
	srcSet?: string;
	start?: number;
	step?: number | string;
	style?: CSS.CSSProperties;
	summary?: string;
	tabIndex?: number;
	target?: string;
	title?: string;
	type?: string;
	useMap?: string;
	value?: string | string[];
	width?: number | string;
	wmode?: string;
	wrap?: string;

	// RDFa Attributes
	about?: string;
	datatype?: string;
	inlist?: any;
	prefix?: string;
	property?: string;
	resource?: string;
	typeof?: string;
	vocab?: string;

	// Non-standard Attributes
	autoCapitalize?: string;
	autoCorrect?: string;
	autoSave?: string;
	color?: string;
	itemProp?: string;
	itemScope?: boolean;
	itemType?: string;
	itemID?: string;
	itemRef?: string;
	results?: number;
	security?: string;
	unselectable?: boolean;

	// Allows aria- and data- Attributes
	[key: string]: any;
}

interface SVGProps extends HTMLAttributes {
}

interface HTMLProps<T> extends HTMLAttributes {
	ref?: string | ((instance: T) => any);
	key?: string | number;
}

export { };
