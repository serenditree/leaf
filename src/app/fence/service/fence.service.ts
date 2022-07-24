import {EXACT_MATCH_FALSE} from '../../utils/st-const';
import {HTTP_HEADERS} from '../../utils/st-const';
import {HTTP_STATUS} from '../../utils/st-const';
import {X_HTTP_HEADERS} from '../../utils/st-const';
import {ActivatedRoute} from '@angular/router';
import {FenceType} from '../model/fence-type.enum';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MessageService} from '../../ui/message/service/message.service';
import {Observable} from 'rxjs';
import {Principal} from '../model/principal';
import {Router} from '@angular/router';
import {StGreetingPipe} from '../../utils/pipes/st-greeting.pipe';
import {StMaple} from '../../utils/st-maple';
import {StOak} from '../../utils/st-oak';
import {Subscriber} from 'rxjs';
import {UiResponse} from '../../ui/model/ui-response';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class FenceService {

    public static readonly ID_KEY = X_HTTP_HEADERS.ID;
    public static readonly USERNAME_KEY = X_HTTP_HEADERS.USERNAME;
    public static readonly EMAIL_KEY = X_HTTP_HEADERS.EMAIL;
    public static readonly PASSWORD_KEY = X_HTTP_HEADERS.PASSWORD;
    public static readonly VERIFICATION_KEY = X_HTTP_HEADERS.VERIFICATION;
    public static readonly TOKEN_KEY = HTTP_HEADERS.AUTHORIZATION;
    public static readonly AUTHENTICATE_KEY = HTTP_HEADERS.WWW_AUTHENTICATE;

    private static readonly BASE_URL_USER = environment.API_BASE_URL_USER;
    private static readonly BASE_URL_USER_AUTH = StMaple.joinUrl(environment.API_BASE_URL_USER, 'auth');
    private static readonly BASE_URL_SEED_AUTH = StMaple.joinUrl(environment.API_BASE_URL_SEED, 'auth');
    private static readonly BASE_URL_POLL_AUTH = StMaple.joinUrl(environment.API_BASE_URL_POLL, 'auth');
    private static readonly USER_GARDEN_LANDING_PATH = '/user/garden';

    private static readonly GREETING = new StGreetingPipe();

    private _principal: Principal = null;

    constructor(private _http: HttpClient,
                private _router: Router,
                private _route: ActivatedRoute,
                private _messageService: MessageService) {
    }

    private static _getEndpoint(fence: FenceType): string {
        let baseUrl;
        switch (fence) {
            case FenceType.USER:
                baseUrl = FenceService.BASE_URL_USER_AUTH;
                break;
            case FenceType.SEED:
                baseUrl = FenceService.BASE_URL_SEED_AUTH;
                break;
            case FenceType.POLL:
                baseUrl = FenceService.BASE_URL_POLL_AUTH;
                break;
        }

        return baseUrl;
    }

    private static _handleFenceError(observer: Subscriber<UiResponse>, error: HttpErrorResponse): void {
        if (error.error instanceof ErrorEvent) {
            console.error(`Client or transport error: ${error.error.message}`);
            observer.error(new UiResponse(1, error.error.message));
        } else {
            if (error.status !== HTTP_STATUS.UNAUTHORIZED &&
                error.status !== HTTP_STATUS.CONFLICT) {
                console.warn(error);
            }
            observer.error(new UiResponse(error.status, error.error ? error.error.message : error.statusText));
        }
    }

    private static _createAuthHeaders(user: Principal): HttpHeaders {
        const authInfo = {};
        authInfo[FenceService.USERNAME_KEY] = user.username;
        authInfo[FenceService.PASSWORD_KEY] = user.password;
        if (user.email) {
            authInfo[FenceService.EMAIL_KEY] = user.email;
        }

        return new HttpHeaders(authInfo);
    }

    /**
     * Sign up for new users.
     * @param principal with minimal authentication data.
     */
    public signUp(principal: Principal): Observable<UiResponse> {

        return this._authenticate(
            StMaple.joinUrl(FenceService.BASE_URL_USER, 'sign-up'),
            FenceService.USER_GARDEN_LANDING_PATH,
            FenceService._createAuthHeaders(principal)
        );
    }

    /**
     * Sign in for registered users
     * @param principal with minimal authentication data.
     */
    public signIn(principal: Principal): Observable<UiResponse> {

        return this._authenticate(
            StMaple.joinUrl(FenceService.BASE_URL_USER, 'sign-in'),
            this._route.snapshot.queryParams['redirect'],
            FenceService._createAuthHeaders(principal)
        );
    }

    public signInRedirect(): void {
        if (!this._router.isActive('/sign-in', EXACT_MATCH_FALSE)) {
            this._signInRedirect();
        }
    }

    public signOut(expired = false): void {
        if (this._principal) {
            try {
                const username = this._principal.username;

                // Removes all auth information.
                this._principal = null;
                localStorage.clear();

                // Redirect from fenced routes if not expired.
                if (!expired &&
                    this._route.root.children.length &&
                    (this._route.root.children[0].snapshot.routeConfig.canActivate ||
                     this._route.root.children[0].snapshot.routeConfig.canActivateChild)) {
                    this._signInRedirect();
                }

                if (expired) {
                    this._messageService.error('Your session expired. Please sign in again!');
                } else {
                    this._messageService.info(`Goodbye ${username}!`);
                }
            } catch (error) {
                this._messageService.error('Sorry, error during sign out!');
                console.error(error);
            }
        } else {
            console.warn('Already signed out!')
        }
    }

    public verify(oidc: string): void {
        const verificationInfo = {};
        verificationInfo[FenceService.VERIFICATION_KEY] = oidc;
        const verificationHeader: HttpHeaders = new HttpHeaders(verificationInfo);
        this._http
            .put<void>(
                StMaple.joinUrl(FenceService.BASE_URL_USER, 'verify'),
                null,
                {observe: 'response', headers: verificationHeader}
            )
            .subscribe(
                (response) => {
                    if (response.ok) {
                        this._messageService.info('Verified!');
                        const token = response.headers.get(FenceService.TOKEN_KEY);
                        localStorage.setItem(FenceService.TOKEN_KEY, token);
                    }
                },
                (error) => {
                    this._messageService.error('Verification failed.');
                    console.log(error);
                }
            );
    }

    public getUsername(): string | null {
        return this._principal === null ? null : this._principal.username.slice();
    }

    public getUserId(): number | null {
        return this._principal === null ? null : this._principal.id;
    }

    public isAuthenticated(): boolean {
        if (this._principal === null) {
            const id = localStorage.getItem(FenceService.ID_KEY);
            const username = localStorage.getItem(FenceService.USERNAME_KEY);
            const token = localStorage.getItem(FenceService.TOKEN_KEY);
            if (StOak.notBlank(username) && StOak.notBlank(token)) {
                this._principal = new Principal(+id, username, null, null, token);
            }
        }

        return this._principal !== null;
    }

    public isAuthorized(fence: FenceType, entityId: number | string, action: string): Observable<UiResponse> {

        let authorizedObservable: Observable<UiResponse>;

        if (this.isAuthenticated()) {

            authorizedObservable = new Observable((observer) => {
                this._http.get<void>(
                    StMaple.joinUrl(FenceService._getEndpoint(fence), this._principal.id, entityId, action),
                    {observe: 'response'}
                ).subscribe(
                    () => {
                        observer.next(new UiResponse(HTTP_STATUS.OK, 'ok'));
                        observer.complete();
                    },
                    (error) => {
                        FenceService._handleFenceError(observer, error);
                    }
                );
            });
        } else {
            authorizedObservable = new Observable((observer) => {
                observer.error(new UiResponse(HTTP_STATUS.UNAUTHORIZED, 'Authentication required.'));
            });
        }

        return authorizedObservable;
    }

    private _signInRedirect(): void {
        void this._router.navigate(['/sign-in'], {queryParams: {redirect: this._router.url}});
    }

    private _authenticate(url: string, redirect: string, authHeaders: HttpHeaders): Observable<UiResponse> {

        return new Observable((observer) => {

            this._http.post<void>(url, null, {headers: authHeaders, observe: 'response'}).subscribe(
                (response) => {
                    const id = response.headers.get(FenceService.ID_KEY);
                    const username = response.headers.get(FenceService.USERNAME_KEY);
                    const token = response.headers.get(FenceService.TOKEN_KEY);

                    localStorage.setItem(FenceService.ID_KEY, id);
                    localStorage.setItem(FenceService.USERNAME_KEY, username);
                    localStorage.setItem(FenceService.TOKEN_KEY, token);

                    this._principal = new Principal(+id, username, null, null, token);

                    if (redirect !== FenceService.USER_GARDEN_LANDING_PATH) {
                        // Landing page already greets...
                        this._messageService.info(FenceService.GREETING.transform(username));
                    }
                    observer.complete();
                    void this._router.navigate([redirect]);
                },
                (error) => {
                    FenceService._handleFenceError(observer, error);
                }
            );
        });
    }
}
