// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from "./database.types"

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ user: Session['user'] | null }>;
		}
		interface PageData {
			user?: Session['user'] | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
