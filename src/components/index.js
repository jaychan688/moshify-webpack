import './index.css'

const blocks = [
	'block-hero',
	'block-domain',
	'block-plan',
	'block-feature',
	'block-showcase',
	'block-testimonial',
	'block-footer',
]

const components = [
	'link',
	'badge',
	'lists',
	'icon',
	'button',
	'input',
	'card',
	'plan',
	'media',
	'quote',
	'grid',
	'testimonial',
	'callouts',
	'collapsible',
	'blocks',
	'navbar',
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

document.querySelector('#root').insertAdjacentHTML(
	'beforeend',
	`<ul class="list list--pink">${blocksLinks}</ul>
	<ul class="list list--green">${componentsLinks}</ul>`
)
