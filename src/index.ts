import render from "render2";
import { Env as RenderEnv }  from "render2";

interface Env {
	R2_BUCKET: R2Bucket,
	ALLOWED_ORIGINS?: string,
	CACHE_CONTROL?: string,
	PATH_PREFIX?: string
	INDEX_FILE?: string
	NOTFOUND_FILE?: string
	DIRECTORY_LISTING?: boolean
	HIDE_HIDDEN_FILES?: boolean
	DIRECTORY_CACHE_CONTROL?: string
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// for each, R2_BUCKET is required
		const config: { [id: string]: RenderEnv; } = {
			"download.81keys.com": {
				R2_BUCKET: env.R2_BUCKET,
				DIRECTORY_LISTING: true,
				HIDE_HIDDEN_FILES: true,
				DIRECTORY_CACHE_CONTROL: "max-age=86400"
			}
		}

		const url = new URL(request.url)
		const domain = url.hostname

		if (config[domain]) {
			// merge, overwriting with new config
			if (config[domain].R2_BUCKET) {
				env = { ...env, ...config[domain] }
			}
		}

		// fall throughh to render
		return render.fetch(request, env, ctx);
	},
};
