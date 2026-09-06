import { Injectable, computed, inject } from '@angular/core';
import { FileConfigService } from './file-config.service';

export interface MqttConfig {
	broker: string;
	port: number;
	path: string;
	username?: string;
	password?: string;
}

@Injectable({ providedIn: 'root' })
export class MqttConfigService {
	private readonly fileConfig = inject(FileConfigService);

	readonly config = computed(() => this.fileConfig.config().mqtt);
	readonly isConfigured = computed(() => this.fileConfig.isConfigured());

	saveConfig(config: MqttConfig): Promise<void> {
		return this.fileConfig.saveConfig({ mqtt: config });
	}
}
