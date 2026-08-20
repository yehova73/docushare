import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Tabzo",
  description:
    "Learn how Tabzo handles your data, local browser storage, and cloud synchronization with privacy-first standards.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Tabzo",
    description:
      "Understand how Tabzo protects your workspace data, tab links, and privacy.",
    url: "https://tabzo.app/privacy",
    siteName: "Tabzo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Tabzo",
    description:
      "Understand how Tabzo protects your workspace data, tab links, and privacy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const PrivacyPolicyPage: React.FC = () => (
  <div className="max-w-6xl mx-auto prose">
    <h1>Privacy Policy</h1>
    <p>
      <strong>Effective Date:</strong> July 26, 2026
    </p>
    <p>
      <strong>Last Updated:</strong> July 26, 2026
    </p>
    <p>
      This Privacy Policy describes how Tabzo ("Tabzo", "Company", "We", "Us",
      or "Our") processes your information when you use our Chrome Extension,
      Web Application, and associated services (collectively, the "Service").
    </p>
    <p>
      We are committed to protecting your personal information and handling it
      responsibly. By accessing or using Tabzo at{" "}
      <Link href="https://tabzo.app">https://tabzo.app</Link> or via our browser
      extension, you acknowledge the processing practices described in this
      Privacy Policy.
    </p>

    <h2>1. Information We Collect</h2>
    <p>
      We collect information directly from you, automatically through your
      interaction with our Service, and via third-party authentication
      providers.
    </p>
    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
      <li>
        <b>A. Data Collected directly and via the Chrome Extension</b>
        <ul>
          <li>
            <strong>Workspace & Tab Metadata:</strong> When you freeze or save a
            workspace, Tabzo collects the full URLs, page titles, favicons, and
            tab order of your open browser tabs. Tab history for restored or
            suspended sessions is generated automatically to manage your
            workspace states.
          </li>
          <li>
            <strong>URLs and Embedded Metadata:</strong> When saving workspace
            sessions, Tabzo collects the full page URLs you have open. Please
            note that certain web applications embed sensitive parameter data
            directly in URLs (such as document IDs, private share tokens, user
            identifiers, or access keys from platforms like Google Docs, Notion,
            or internal dashboards). Tabzo handles these URLs strictly as
            workspace configuration data, but users should avoid intentionally
            saving URLs containing temporary authentication tokens or other
            sensitive credentials.
          </li>
          <li>
            <strong> Workspace Content:</strong> For synced accounts, we store
            the content you input into your workspace tools, including the
            Markdown Scratchpad (notes, code snippets, documentation links) and
            Focus Micro-Tasks (checklists and task completion statuses).{" "}
          </li>
          <li>
            <strong>
              Chrome Storage API <code>(chrome.storage.local)</code>:
            </strong>{" "}
            For both anonymous and registered users, workspace data, preference
            settings, active tab states, and temporary caches are stored
            strictly on your local machine using Chrome’s{" "}
            <code>chrome.storage.local</code> API. We do not utilize{" "}
            <code>chrome.storage.sync</code> or{" "}
            <code>chrome.storage.session</code>.{" "}
          </li>
        </ul>
      </li>
      <li>
        <b>B. User Account & Identity Data</b>
        <ul>
          <li>
            <strong>Anonymous Accounts:</strong> Free Tier users may utilize
            Tabzo without providing an email address or password. In this mode,
            an anonymous identifier is generated to manage local workspace state
            and sync limits.
          </li>
          <li>
            <strong>Claimed & Registered Accounts:</strong> When you create or
            claim an account (to enable cloud syncing across devices or upgrade
            to paid tiers), we collect:
            <ul>
              <li>Email address</li>
              <li>
                Profile information provided by third-party identity providers
                (e.g., name, profile picture, or unique OAuth ID if signing in
                via Google or future OAuth providers such as GitHub)
              </li>
              <li>
                Account credentials managed securely via NextAuth (e.g., hashed
                authentication tokens or Magic Link session tokens).
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <b>C. Billing & Payment Data</b>
        <ul>
          <li>
            Payments are processed by <strong>Stripe</strong>. When you
            subscribe to a paid tier (Solo Pro or Team/Agency), Stripe collects
            your billing details, such as payment card information, billing
            address, and transaction details.
          </li>
          <li>
            <strong> Note:</strong> Tabzo does not store or process your raw
            credit card or banking details on our servers. Stripe handles all
            payment processing under its own privacy policy and compliance
            standards.
          </li>
        </ul>
      </li>
      <li>
        <b>D. System, Operational & Diagnostic Data</b>
        <ul>
          <li>
            <strong>Hosting & Telemetry:</strong> Our Web Application and API
            infrastructure are hosted on <strong>Vercel</strong>. Vercel
            automatically collects standard network server logs, which may
            include your IP address, browser type, operating system, timestamp,
            and HTTP request headers necessary for service delivery, security
            monitoring, and network performance.
          </li>
        </ul>
      </li>
    </ul>
    <h2>2. Chrome Extension Permissions & Web Store Disclosures</h2>
    <p>
      To provide window freezing, taskbar naming, and workspace restoration, the
      Tabzo Chrome Extension requires specific browser permissions. Each
      permission is requested strictly for core app functionality:
    </p>
    <ul>
      <li>
        <strong>storage:</strong> Required to store workspace configurations,
        notes, tasks, and settings locally using{" "}
        <code>chrome.storage.local</code>.
      </li>
      <li>
        <strong>tabs:</strong> Required to query open tab URLs, page titles,
        favicons, and tab index positions to perform window freezing,
        restoration, and inter-op link jumping.
      </li>
      <li>
        <strong>windows:</strong> Required to create, close, and manage isolated
        browser window frames and inject project prefaces into OS window
        headers.
      </li>
      <li>
        <strong>cookies:</strong> Required to authenticate and maintain session
        synchronization between the Chrome Extension and the Tabzo Web
        Application.
      </li>
      <li>
        <strong>system.display:</strong> Required to detect display bounds and
        monitor configurations so restored workspace windows open seamlessly on
        the correct physical monitor.
      </li>
    </ul>
    <h4>Google Chrome Web Store Privacy Disclosure</h4>
    <ul>
      <li>
        <strong>No Sale of Personal Information:</strong> Tabzo does{" "}
        <strong>not sell</strong>, rent, or trade your personal information or
        workspace data to third parties.
      </li>
      <li>
        <strong>No Advertising Use:</strong> Tabzo does <strong>not use</strong>
        , transfer, or disclose collected tab data or user information to serve
        targeted advertising, cross-site tracking, or credit/lending
        assessments.
      </li>
      <li>
        <strong>Single Purpose Usage:</strong> Data collected via Chrome
        Extension permissions is used exclusively to provide and improve Tabzo's
        core tab management functionality.
      </li>
    </ul>

    <h2>3. How We Use Your Information</h2>
    <p>
      We use the collected information for the following operational purposes:
    </p>
    <ul>
      <li>
        <strong>Core Service Delivery:</strong> To suspend, save, organize, and
        restore your browser tabs, as well as render your Index-0 Workspace
        Dashboard, Markdown notes, and micro-task lists.
      </li>
      <li>
        <strong>Account Management & Synchronization:</strong> To allow
        cross-device cloud synchronization of your workspaces, manage your
        account status (Anonymous vs. Claimed), and administer subscription
        tiers.
      </li>
      <li>
        <strong>Communication:</strong> To send essential account notifications,
        authentication links (Magic Links), subscription updates, and customer
        support communications via Brevo.
      </li>
      <li>
        <strong>Payment Processing:</strong> To enable Stripe to bill, manage,
        and verify subscriptions for paid tiers.
      </li>
      <li>
        <strong>Security & Infrastructure Maintenance:</strong> To protect
        against fraudulent usage, perform system maintenance, and ensure
        infrastructure stability via Vercel.
      </li>
    </ul>

    <h2>4. Legal Bases for Processing (GDPR)</h2>
    <p>
      If you are located in the European Economic Area (EEA), United Kingdom, or
      Switzerland, we process your personal data under the following legal bases
      established by Regulation (EU) 2016/679 (GDPR):
    </p>

    <table>
      <thead>
        <tr>
          <th>Purpose / Processing Activity</th>
          <th>Categories of Personal Data</th>
          <th>Legal Basis under GDPR</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Account Creation &amp; Authentication</strong>
          </td>
          <td>Email address, OAuth IDs, session tokens</td>
          <td>
            <strong>Art. 6(1)(b) - Contract Performance:</strong> Necessary to
            create and manage your Tabzo user account.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Workspace Sync &amp; Cloud Features</strong>
          </td>
          <td>Tab URLs, page titles, favicons, Markdown notes, micro-tasks</td>
          <td>
            <strong>Art. 6(1)(b) - Contract Performance:</strong> Necessary to
            deliver cross-device syncing and saved workspace features.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Subscription Management &amp; Payment</strong>
          </td>
          <td>Transaction records, payment tokens, billing details</td>
          <td>
            <strong>
              Art. 6(1)(b) - Contract Performance &amp; Art. 6(1)(c) - Legal
              Obligation:
            </strong>{" "}
            Necessary to fulfill your subscription and comply with statutory
            tax/accounting obligations.
          </td>
        </tr>
        <tr>
          <td>
            <strong>Transactional Communications</strong>
          </td>
          <td>Email address, account status, security alerts</td>
          <td>
            <strong>Art. 6(1)(b) - Contract Performance:</strong> Necessary to
            send authentication links (Magic Links), service alerts, and account
            notices via Brevo.
          </td>
        </tr>
        <tr>
          <td>
            <strong>System Security, Logging &amp; Infrastructure</strong>
          </td>
          <td>IP address, browser type, standard HTTP request headers</td>
          <td>
            <strong>Art. 6(1)(f) - Legitimate Interests:</strong> Necessary to
            secure our Vercel infrastructure, prevent fraud, and maintain
            network stability (as recognized in GDPR Recital 49).
          </td>
        </tr>
        <tr>
          <td>
            <strong>Customer Support &amp; Assistance</strong>
          </td>
          <td>Email address, support tickets, user-provided context</td>
          <td>
            <strong>
              Art. 6(1)(f) - Legitimate Interests / Art. 6(1)(b) - Contract
              Performance:
            </strong>{" "}
            Necessary to respond to inquiries and assist you with technical
            issues.
          </td>
        </tr>
      </tbody>
    </table>
    <h2>5. Third-Party Service Providers</h2>
    <p>
      We share necessary data with trusted third-party service providers
      strictly to operate, host, and maintain our Service. These third parties
      access your information solely to perform tasks on our behalf and are
      obligated not to disclose or use it for any other purpose:
    </p>
    <table>
      <thead>
        <tr>
          <th>Provider</th>
          <th>Purpose</th>
          <th>Information Shared</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Vercel</strong>
          </td>
          <td>Cloud Infrastructure, Hosting &amp; Backend API</td>
          <td>System requests, IP addresses, application backend data</td>
        </tr>
        <tr>
          <td>
            <strong>Stripe</strong>
          </td>
          <td>Subscription Billing &amp; Payment Processing</td>
          <td>
            Billing name, email address, transaction history, payment tokens
          </td>
        </tr>
        <tr>
          <td>
            <strong>Brevo</strong>
          </td>
          <td>Email Delivery &amp; Service Messaging</td>
          <td>User email address, transactional email logs</td>
        </tr>
      </tbody>
    </table>

    <h4>Future Analytics Notice</h4>
    <p>
      We do not currently deploy non-essential tracking or behavioral analytics
      cookies. However, we plan to integrate Google Analytics in future updates
      to better understand product usage patterns and improve user experience.
      When implemented, <strong>Google Analytics </strong>may collect anonymous
      device information, usage metrics, and IP addresses, and this policy will
      be updated accordingly.
    </p>

    <h2>6. AI Features & Future Services</h2>
    <p>
      Tabzo does not currently use third-party AI services to process user
      content.
    </p>
    <h2>7. Cookies and Local Browser Storage</h2>
    <p>
      Tabzo uses essential cookies and local browser storage necessary to
      operate the platform securely:
    </p>
    <ul>
      <li>
        <strong>Essential Authentication Cookies:</strong> Managed via{" "}
        <strong>NextAuth</strong>
        on our Web Application, including session cookies and CSRF tokens.
        <ul>
          <li>
            <code>
              next-auth.session-token / __Secure-next-auth.session-token
            </code>{" "}
            (Maintains your active logged-in user session).
          </li>
          <li>
            <code>next-auth.csrf-token / __Host-next-auth.csrf-token</code>{" "}
            (Protects against Cross-Site Request Forgery attacks).
          </li>
          <li>
            <code>next-auth.callback-url</code> (Stores redirect state during
            OAuth or Magic Link authentication).
          </li>
        </ul>
      </li>
      <li>
        <strong>Local Storage:</strong> (<code>chrome.storage.local</code>)
        Utilized by the Chrome Extension strictly on your local machine to store
        workspace caches, offline state, and settings.
      </li>
    </ul>
    <p>
      We do not use third-party advertising cookies or cross-site behavioral
      tracking cookies.
    </p>
    <h2>8. Data Storage, Retention, and International Transfers</h2>
    <ul>
      <li>
        <strong>Primary Infrastructure & Storage Location:</strong> Tabzo's web
        application, API infrastructure, and primary database services are
        hosted on <strong>Vercel</strong>. Data may be processed in the United
        States and other countries where our service providers operate.{" "}
      </li>
      <li>
        <strong>International Data Transfers:</strong> Personal data originating
        from the European Economic Area (EEA) or UK that is transferred to the
        United States is protected using the European Commission’s{" "}
        <strong>Standard Contractual Clauses (SCCs)</strong> or equivalent
        lawful transfer mechanisms implemented by our cloud providers (Vercel,
        Stripe, Brevo).{" "}
      </li>
      <li>
        <strong>Data Retention:</strong>
        <ul>
          <li>
            <strong>Local Extension Data:</strong> Remains stored on your local
            device via <code>chrome.storage.local</code> until you uninstall the
            Chrome Extension or manually clear your browser extension storage.
          </li>
          <li>
            <strong>Cloud Workspaces:</strong> Saved workspace metadata,
            Markdown notes, and tasks associated with registered accounts are
            retained for as long as your account remains active.
          </li>
          <li>
            <strong>Account Deletion Options:</strong> You can delete your
            account directly through your in-app account settings for immediate
            automated removal, or request deletion by emailing{" "}
            <a href="mailto:support@tabzo.app">support@tabzo.app</a>. Upon
            account deletion, all associated cloud-synced workspaces, notes, and
            user profile records are permanently removed from our active
            databases, except where longer retention is strictly required by
            applicable law (e.g., financial transaction records retained for tax
            compliance via Stripe).
          </li>
        </ul>
      </li>
    </ul>
    <h2>9. Account Claiming & Data Linking</h2>
    <p>
      Free Tier users operate with anonymous local accounts. If you choose to
      claim your account by signing in with an email address or OAuth provider:
    </p>
    <ul>
      <li>
        Your locally cached workspaces will be associated with your newly
        registered user account.
      </li>
      <li>
        This allows your tab states, Markdown scratchpads, and task lists to
        sync securely to our cloud database across different machines and
        browser instances.
      </li>
    </ul>
    <h2>10. Your Choices &amp; Data Control</h2>
    <p>You have full control over your data within Tabzo:</p>
    <ol>
      <li>
        <strong>Data Export:</strong> You can export your saved workspaces, tab
        links, and notes at any time directly through the data export options in
        the Tabzo Web Application.
      </li>
      <li>
        <strong>Account Deletion:</strong> You may permanently delete your
        account and clear all cloud-synced workspaces instantly through your
        in-app Account Settings.
      </li>
      <li>
        <strong>Disable Cloud Sync:</strong> You can choose to use Tabzo on the
        Free Tier without creating an account, keeping all workspace data stored
        100% locally on your machine via <code>chrome.storage.local</code>.
      </li>
      <li>
        <strong>Uninstall Extension:</strong> Uninstalling the extension
        generally removes its locally stored data. Users may also clear
        extension data through their browser settings.
      </li>
    </ol>
    <h2>11. European Privacy Rights (GDPR)</h2>
    <p>
      If you reside in the European Economic Area (EEA), you have the following
      rights regarding your personal data under the General Data Protection
      Regulation (GDPR):
    </p>
    <ol>
      <li>
        <strong>Right of Access:</strong> The right to request copies of your
        personal data.
      </li>
      <li>
        <strong>Right to Rectification:</strong> The right to request that we
        correct inaccurate or incomplete information.
      </li>
      <li>
        <strong>Right to Erasure ("Right to be Forgotten"):</strong> The right
        to request that we erase your personal data.
      </li>
      <li>
        <strong>Right to Restrict Processing:</strong> The right to request that
        we restrict the processing of your data.
      </li>
      <li>
        <strong>Right to Data Portability:</strong> The right to request that we
        transfer your collected data to another organization or directly to you
        in a structured format.
      </li>
      <li>
        <strong>Right to Object:</strong> The right to object to our processing
        of your personal data based on legitimate interests.
      </li>
      <li>
        <strong>Right to Withdraw Consent:</strong> Where processing is based on
        consent, you have the right to withdraw consent at any time without
        affecting prior lawful processing.
      </li>
    </ol>
    <p>
      To exercise any of these rights, please contact us at{" "}
      <a href="mailto:support@tabzo.app">support@tabzo.app</a>. We will respond
      within the time required by applicable law (generally within one month
      under the GDPR).
    </p>
    <h2>12. Security Measures</h2>
    <p>
      We implement standard, industry-accepted security practices to safeguard
      your information:
    </p>
    <ul>
      <li>
        <strong>Encryption in Transit:</strong> All communications between the
        Tabzo Chrome Extension, Web Application, and Vercel cloud infrastructure
        are encrypted using standard <code>HTTPS/TLS</code> protocols.
      </li>
      <li>
        <strong>Secure Authentication:</strong> User authentication is managed
        using secure session tokens and industry-standard authentication
        mechanisms.
      </li>
      <li>
        <strong>Payment Security:</strong> Payment card details and financial
        transactions are processed entirely within Stripe&rsquo;s PCI-DSS
        compliant environment.
      </li>
    </ul>
    <p>
      While we take reasonable technical precautions to protect your data, no
      method of digital transmission over the internet or electronic storage can
      be guaranteed to be 100% secure.
    </p>
    <h2>13. Children&rsquo;s Privacy</h2>
    <p>
      Tabzo is a general audience productivity tool designed for developers,
      researchers, and professionals. Our Service is not directed to children
      under the age of 13 (or 16 in certain jurisdictions). We do not knowingly
      collect personal information from children. If you believe a child has
      provided us with personal data, please contact us at{" "}
      <a href="mailto:support@tabzo.app">support@tabzo.app</a> so we can delete
      the information promptly.
    </p>

    <h2>14. Governing Law</h2>
    <p>
      This Privacy Policy and any disputes arising out of or related to the use
      of Tabzo shall be governed by and construed in accordance with the laws of
      Romania, without giving effect to any principles of conflicts of law.
    </p>

    <h2>15. Changes to This Privacy Policy</h2>
    <p>
      We may update our Privacy Policy from time to time to reflect changes in
      our technology, legal obligations, or product features. Any updates will
      be posted on this page with an updated &ldquo;Last Updated&rdquo; date at
      the top. We encourage you to review this Privacy Policy periodically.
      Continued use of the Service after any changes constitutes acceptance of
      the updated policy.
    </p>
    <h2>16. Contact Information &amp; Data Controller</h2>
    <p>
      Tabzo is operated by its developer as an independent software project
      based in Romania. If you have any questions, concerns, or data deletion
      requests regarding this Privacy Policy or Tabzo&rsquo;s privacy practices,
      please contact us at:
    </p>
    <ul>
      <li>
        <strong>Support &amp; Privacy Email:</strong>{" "}
        <a href="mailto:support@tabzo.app">support@tabzo.app</a>
      </li>
      <li>
        <strong>Official Website Contact Page:</strong>{" "}
        <a href="https://tabzo.app/contact">https://tabzo.app/contact</a>
      </li>
    </ul>
  </div>
);

export default PrivacyPolicyPage;
