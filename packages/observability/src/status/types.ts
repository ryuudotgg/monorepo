export interface BetterStackResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      auth_password: string;
      auth_username: string;
      call: boolean;
      check_frequency: number;
      confirmation_period: number;
      created_at: string;
      domain_expiration: unknown;
      email: boolean;
      expected_status_codes: unknown[];
      follow_redirects: boolean;
      http_method: string;
      last_checked_at: string;
      maintenance_from: unknown;
      maintenance_timezone: string;
      maintenance_to: unknown;
      monitor_group_id: unknown;
      monitor_type: string;
      paused_at: unknown;
      paused: boolean;
      policy_id: unknown;
      port: unknown;
      pronounceable_name: string;
      push: boolean;
      recovery_period: number;
      regions: string[];
      remember_cookies: boolean;
      request_body: string;
      request_headers: unknown[];
      request_timeout: number;
      required_keyword: unknown;
      sms: boolean;
      ssl_expiration: unknown;
      status:
        | "down"
        | "maintenance"
        | "paused"
        | "pending"
        | "up"
        | "validating";
      team_wait: unknown;
      updated_at: string;
      url: string;
      verify_ssl: boolean;
    };
    relationships: {
      policy: { data: unknown };
    };
  }[];
  pagination: {
    first: string;
    last: string;
    prev: unknown;
    next: unknown;
  };
}
