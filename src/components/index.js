import './index.css'

const pages = [
	'block-domain',
	'block-feature',
	'block-footer',
	'block-hero',
	'block-plan',
	'block-showcase',
	'block-testimonial',
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
	'Testimonials',
]

const links = pages
	.map(page => `<li class="list__item"><a href="${page}.html">${page}</a></li>`)
	.join('')

document.body.insertAdjacentHTML('beforeend', `<ul class="list">${links}</ul>`)
