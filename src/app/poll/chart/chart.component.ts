import {Chart} from 'chart.js';
import {Component} from '@angular/core';
import {ElementRef} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {FenceType} from '../../fence/model/fence-type.enum';
import {Input} from '@angular/core';
import {OnInit} from '@angular/core';
import {PollOption} from '../model/poll-option';
import {PollService} from '../service/poll.service';
import {Poll} from '../model/poll';
import {ViewChild} from '@angular/core';

@Component(
    {
        selector: 'st-chart',
        templateUrl: './chart.component.html',
        styleUrls: ['./chart.component.scss']
    }
)
export class ChartComponent implements OnInit {

    private static readonly DEFAULT_FONT_FAMILY = 'Quicksand';
    private static readonly TOOLTIPS_BACKGROUND_COLOR = 'rgba(97, 97, 97, 0.9)';
    private static readonly ANIMATION_DURATION = 1400;
    private static readonly DISPLAY_LEGEND = false;
    private static readonly CHART_TYPE = 'doughnut';
    private static readonly HOVER_BORDER_COLOR = '#fff';
    private static readonly COLOR_SCHEME = [
        'rgb(120,144,156)',
        'rgba(167, 192, 205, 1)',
        'rgba(192, 217, 230, 1)',
        'rgba(220, 224, 220, 1)',
        'rgba(233, 233, 228, 1)',
        'rgba(242, 243, 240, 1)'
    ];
    private static readonly COLOR_SCHEME_HOVER = [
        'rgba(120, 144, 156, .7)',
        'rgba(167, 192, 205, .7)',
        'rgba(192, 217, 230, .7)',
        'rgba(220, 224, 220, .7)',
        'rgba(233, 233, 228, .7)',
        'rgba(242, 243, 240, .7)'
    ];

    private _poll: Poll;
    private _selectedOption: PollOption;
    private _totalVotes = 0;
    private _isVotingAllowed = false;

    @ViewChild('chartCanvas', {static: true})
    private _chartCanvas: ElementRef;
    private _chart: Chart;
    private _data: number[] = [];
    private _labels: string[] = [];

    constructor(private _pollService: PollService,
                private _fenceService: FenceService) {
        Chart.defaults.global.defaultFontFamily = ChartComponent.DEFAULT_FONT_FAMILY;
        Chart.defaults.global.tooltips.backgroundColor = ChartComponent.TOOLTIPS_BACKGROUND_COLOR;
        Chart.defaults.global.animation.duration = ChartComponent.ANIMATION_DURATION;
        Chart.defaults.global.legend.display = ChartComponent.DISPLAY_LEGEND;
    }

    get poll(): Poll {
        return this._poll;
    }

    @Input()
    set poll(value: Poll) {
        this._poll = value;
    }

    get selectedOption(): PollOption {
        return this._selectedOption;
    }

    set selectedOption(value: PollOption) {
        this._selectedOption = value;
    }

    get totalVotes(): number {
        return this._totalVotes;
    }

    get isVotingAllowed(): boolean {
        return this._isVotingAllowed;
    }

    get isAuthenticated(): boolean {
        return this._fenceService.isAuthenticated();
    }

    ngOnInit(): void {
        if (this._fenceService.isAuthenticated()) {
            this._fenceService.isAuthorized(FenceType.POLL, this._poll.id, 'vote')
                .subscribe(
                    (response) => {
                        this._isVotingAllowed = response.ok();
                    },
                    () => {
                        this._isVotingAllowed = false;
                    }
                );
        }

        this._setChartData();

        if (this._totalVotes > 0) {
            this._initChart();
        }
    }

    public vote(): void {
        Chart.defaults.global.animation.duration = 0;
        this._isVotingAllowed = false;

        this._pollService.vote(this.poll.id, this.selectedOption.id)
            .subscribe(
                () => {
                    this.selectedOption.votes += 1;
                    this._setChartData(true);
                    this._initChart();
                },
                (error) => {
                    // TODO feedback
                    this._isVotingAllowed = true;
                    console.error(error);
                }
            );
    }

    public legendColor(index: number): string {
        return ChartComponent.COLOR_SCHEME[index % ChartComponent.COLOR_SCHEME.length];
    }

    private _initChart(): void {
        this._chart = new Chart(this._chartCanvas.nativeElement, {
            type: ChartComponent.CHART_TYPE,
            data: {
                labels: this._labels,
                datasets: [
                    {
                        data: this._data,
                        backgroundColor: ChartComponent.COLOR_SCHEME,
                        hoverBackgroundColor: ChartComponent.COLOR_SCHEME_HOVER,
                        hoverBorderColor: ChartComponent.HOVER_BORDER_COLOR
                    }
                ]
            },
            options: {
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        label: this._setChartLabel.bind(this)
                    }
                }
            }
        });
    }

    private _setChartData(update: boolean = false): void {
        if (update) {
            this._data = [];
            this._labels = [];
            this._totalVotes = 0;
        }
        this._poll.options.forEach(
            (option) => {
                this._labels.push(option.text);
                this._data.push(option.votes);
                this._totalVotes += option.votes;
            }
        );
    }

    private _setChartLabel(item: any): string {
        const label = this._labels[item.index];
        const votes = this._data[item.index];
        const percentage = Math.round(votes / this._totalVotes * 100);

        return `${label}: ${percentage}% (${votes})`;
    }

}
