import './index.pcss'

const blocks = [
	'block-domain',
	'block-feature',
	'block-footer',
	'block-hero',
	'block-plan',
	'block-showcase',
	'block-testimonial',
]

const components = [
	'badge',
	'blocks',
	'button',
	'callouts',
	'card',
	'collapsible',
	'grid',
	'icon',
	'input',
	'link',
	'lists',
	'media',
	'navbar',
	'plan',
	'quote',
	'testimonials',
]

const blocksLinks = blocks
	.map(
		blocks =>
			`<li><a class="list__item" target="_blank" href="${blocks}.html">${blocks}</a></li>`
	)
	.join('')

const componentsLinks = components
	.map(
		components =>
			`<li><a class="list__item" target="_blank" href="${components}.html">${components}</a></li>`
	)
	.join('')

document.body.insertAdjacentHTML(
	'beforeend',
	`<ul class="list list--pink">${blocksLinks}</ul>
	<ul class="list list--green">${componentsLinks}</ul>`
)

if (module.hot) {
	module.hot.accept()
}
