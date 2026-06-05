import {Chart} from 'chart.js/auto';
import {Component, ElementRef, Input, OnInit, ViewChild, inject, ChangeDetectionStrategy} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {FenceType} from '../../fence/model/fence-type.enum';
import {PollOption} from '../model/poll-option';
import {PollService} from '../service/poll.service';
import {Poll} from '../model/poll';
import {StUtils} from '../../utils/st-utils';

@Component(
    {
        selector: 'st-chart',
        templateUrl: './chart.component.html',
        styleUrls: ['./chart.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class ChartComponent implements OnInit {
    private _pollService = inject(PollService);
    private _fenceService = inject(FenceService);

    private static readonly DEFAULT_FONT = {
        family: 'Quicksand',
        size: 12
    };
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
    private _pollOptions: PollOption[];
    private _selectedIndex = -1;
    private _totalVotes = 0;
    private _isVotingAllowed = false;

    @ViewChild('chartCanvas', {static: true})
    private _chartCanvas: ElementRef;
    private _chart: Chart;

    get poll(): Poll {
        return this._poll;
    }

    @Input()
    set poll(value: Poll) {
        this._poll = value;
    }

    get pollOptions(): PollOption[] {
        return this._pollOptions;
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(value: number) {
        this._selectedIndex = value;
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
        this._pollOptions = this._poll.options.sort((opt1, opt2) => opt1.id - opt2.id);

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

        this._initChart();
        this._setChartData();
    }

    public vote(): void {
        this._isVotingAllowed = false;

        this._pollService.vote(this.poll.id, this.pollOptions[this.selectedIndex].id)
            .subscribe(
                () => {
                    this.pollOptions[this.selectedIndex].votes += 1;
                    this._totalVotes += 1;
                    this._setChartData(true);
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
        this._chart = new Chart(
            this._chartCanvas.nativeElement,
            {
                type: ChartComponent.CHART_TYPE,
                data: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            backgroundColor: ChartComponent.COLOR_SCHEME,
                            hoverBackgroundColor: ChartComponent.COLOR_SCHEME_HOVER,
                            hoverBorderColor: ChartComponent.HOVER_BORDER_COLOR
                        }
                    ]
                },
                options: {
                    animation: {
                        animateRotate: true,
                        animateScale: false,
                        duration: ChartComponent.ANIMATION_DURATION,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: ChartComponent.DISPLAY_LEGEND
                        },
                        tooltip: {
                            enabled: true,
                            displayColors: false,
                            backgroundColor: ChartComponent.TOOLTIPS_BACKGROUND_COLOR,
                            titleFont: ChartComponent.DEFAULT_FONT,
                            bodyFont: ChartComponent.DEFAULT_FONT,
                            callbacks: {
                                title: this._setTooltipTitle.bind(this),
                                label: this._setTooltipLabel.bind(this)
                            }
                        }
                    }
                }
            }
        );
    }

    private _setChartData(update = false): void {
        if (update) {
            this._chart.data.datasets[0].data[this.selectedIndex] = this._pollOptions[this.selectedIndex].votes;
        } else {
            this._pollOptions.forEach(
                (option) => {
                    this._chart.data.labels.push(option.text);
                    this._chart.data.datasets[0].data.push(option.votes);
                    this._totalVotes += option.votes;
                }
            );
        }
        this._chart.update();
    }

    private _setTooltipTitle(data: any): string {
        const label = this._chart.data.labels[data[0].dataIndex] as string;

        return StUtils.ellipsis(label, 16);
    }

    private _setTooltipLabel(data: any): string {
        const votes = this._chart.data.datasets[0].data[data.dataIndex] as number;
        const percentage = Math.round(votes / this._totalVotes * 100);

        return `${percentage}% (${votes})`;
    }
}
