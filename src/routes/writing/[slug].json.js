import { getWriting, getOneDoc } from './_writing.js';

export function get(req, res, next) {
	const { slug } = req.params;

	const writing = slug === 'all' ? getWriting() : getOneDoc(slug);

	if (typeof writing === 'object') {
		res.writeHead(200, {
			'Content-Type': 'application/json',
		});
		res.end(JSON.stringify(writing));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json',
		});
		res.end(
			JSON.stringify({
				message: `Not found`,
			})
		);
	}
}
