export const environmentHostname = window.location.hostname;
export const environment = {
    id: 'prod',
    production: true,
    HOSTNAME: environmentHostname,
    API_BASE_URL_SEED: `https://${environmentHostname}/api/v1/seed`,
    API_BASE_URL_GARDEN: `https://${environmentHostname}/api/v1/garden`,
    API_BASE_URL_USER: `https://${environmentHostname}/api/v1/user`,
    API_BASE_URL_POLL: `https://${environmentHostname}/api/v1/poll`,
    API_URL_MAP: `https://${environmentHostname}/styles/positron/style.json`
};
