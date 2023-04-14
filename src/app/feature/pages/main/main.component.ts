import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'
import { MainTabletHeaderComponent } from "@feature/molecules/main/main-tablet-header/main-tablet-header.component";
import { MainMenuComponent } from "@feature/molecules/main/main-menu/main-menu.component";

@Component({
    standalone: true,
    selector: 'rwp-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [RouterOutlet, CommonModule, MainTabletHeaderComponent, MainMenuComponent]
})
export class MainComponent {}
