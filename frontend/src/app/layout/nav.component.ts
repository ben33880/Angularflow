import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MqttService } from '../../services/mqtt.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="w-[260px] bg-bg-secondary border-r border-white/10 flex flex-col p-6 fixed h-screen z-[100]">
      <div class="flex items-center gap-3 text-2xl font-bold text-text-primary mb-8 pb-6 border-b border-white/10">
        <i class="bi bi-water text-4xl bg-gradient-primary bg-clip-text" style="-webkit-text-fill-color: transparent"></i>
        <span>Flow.io</span>
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <a routerLink="/dashboard" routerLinkActive="active" 
           class="flex items-center gap-3 px-4 py-3.5 text-text-secondary no-underline rounded-xl transition-all duration-200 font-medium hover:bg-blue-500/10 hover:text-text-primary active:bg-gradient-primary active:text-white active:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
          <i class="bi bi-speedometer2 text-2xl"></i>
          <span>Dashboard</span>
        </a>
        <a routerLink="/devices" routerLinkActive="active" 
           class="flex items-center gap-3 px-4 py-3.5 text-text-secondary no-underline rounded-xl transition-all duration-200 font-medium hover:bg-blue-500/10 hover:text-text-primary active:bg-gradient-primary active:text-white active:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
          <i class="bi bi-cpu text-2xl"></i>
          <span>&Eacute;quipements</span>
        </a>
        <a routerLink="/system" routerLinkActive="active" 
           class="flex items-center gap-3 px-4 py-3.5 text-text-secondary no-underline rounded-xl transition-all duration-200 font-medium hover:bg-blue-500/10 hover:text-text-primary active:bg-gradient-primary active:text-white active:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
          <i class="bi bi-pc-display text-2xl"></i>
          <span>Syst&egrave;me</span>
        </a>
        <a routerLink="/config" routerLinkActive="active" 
           class="flex items-center gap-3 px-4 py-3.5 text-text-secondary no-underline rounded-xl transition-all duration-200 font-medium hover:bg-blue-500/10 hover:text-text-primary active:bg-gradient-primary active:text-white active:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
          <i class="bi bi-gear text-2xl"></i>
          <span>Config</span>
        </a>
        <a routerLink="/logs" routerLinkActive="active" 
           class="flex items-center gap-3 px-4 py-3.5 text-text-secondary no-underline rounded-xl transition-all duration-200 font-medium hover:bg-blue-500/10 hover:text-text-primary active:bg-gradient-primary active:text-white active:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
          <i class="bi bi-journal-text text-2xl"></i>
          <span>Logs</span>
        </a>
        <a routerLink="/alarms" routerLinkActive="active" 
           class="flex items-center gap-3 px-4 py-3.5 text-text-secondary no-underline rounded-xl transition-all duration-200 font-medium hover:bg-blue-500/10 hover:text-text-primary active:bg-gradient-primary active:text-white active:shadow-[0_4px_15px_rgba(59,130,246,0.4)]">
          <i class="bi bi-exclamation-triangle text-2xl"></i>
          <span>Alarmes</span>
        </a>
      </div>
      <div class="pt-6 border-t border-white/10">
        <div class="flex items-center gap-2 text-sm text-text-secondary px-3 py-2 rounded-lg bg-white/5 transition-all duration-300"
             [class.bg-green-500/10]="mqttConnected()"
             [class.border]="mqttConnected()"
             [class.border-green-500/30]="mqttConnected()"
             [class.text-green-400]="mqttConnected()">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                [class.shadow-[0_0_10px_#10b981]]="mqttConnected()"></span>
          <span>{{ mqttConnected() ? 'MQTT connect&eacute;' : 'En ligne (HTTP)' }}</span>
        </div>
      </div>
    </nav>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
  private readonly mqtt = inject(MqttService);
  readonly mqttConnected = this.mqtt.connected;
}
