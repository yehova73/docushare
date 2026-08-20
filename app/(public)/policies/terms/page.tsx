import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Tabzo",
  description:
    "Review the terms, conditions, and user agreements for using the Tabzo Chrome extension and web application.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Tabzo",
    description:
      "Terms and conditions governing your use of Tabzo products and services.",
    url: "https://tabzo.app/terms",
    siteName: "Tabzo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Tabzo",
    description:
      "Terms and conditions governing your use of Tabzo products and services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TermsAndConditionsPage: React.FC = () => (
  <div className="max-w-6xl mx-auto prose">
    <h1>Terms of Service</h1>

    <p>
      <strong>Effective Date:</strong> July 26, 2026
    </p>
    <p>
      <strong>Last Updated:</strong> July 26, 2026
    </p>

    <p>
      The following terms and conditions (the &ldquo;Terms&rdquo;) form a
      binding agreement between you, in your individual capacity or on behalf of
      the Organisation you represent, as applicable, and the operator of the
      Tabzo service (&ldquo;Tabzo,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
      &ldquo;our&rdquo;), and govern your use of the internet-based
      applications, software, browser extension(s), services and websites
      offered by Tabzo (the &ldquo;Services&rdquo;).
    </p>
    <h2>1. Customers and Authorised Users</h2>
    <p>
      These Terms apply to both Customers and Authorised Users, as applicable
      and as set forth below.
    </p>
    <p>
      A <strong>“Customer”</strong> is you or the Organisation that you
      represent in agreeing to these Terms and creating an account on the
      Service, as indicated by you at the time of your creation of an account.
      If you create an account but do not have the necessary organisational
      authority to enter into the Terms on behalf of such Organisation, then you
      as an individual are the Customer. For example, if you signed up using a
      personal email address and invited colleagues to collaborate but have not
      formed a company yet, you are the Customer. If you sign up using a primary
      email address with a domain owned by your company and you have the
      necessary authority to bind your company to these Terms, then your company
      is the Customer.
    </p>
    <p>
      An <strong>“Authorised User”</strong> is a person who a Customer, or a
      person with admin access on a Customer’s account, has invited to
      participate in a Customer account (including Team plan seats).
    </p>
    <p>
      An <strong>“Organisation”</strong> is a corporation, limited liability
      company, company or other legal entity other than a natural person.
    </p>
    <h2>2. Acceptance of the Terms</h2>
    <p>
      By creating an account, installing the Tabzo browser extension, or by
      entering into an agreement to purchase a Subscription (as defined below),
      you agree, as an individual or on behalf of the Organisation that you
      represent, as applicable, to be bound by these Terms as Customer.
    </p>
    <p>
      By accepting an invitation to join an account created by a Customer or
      otherwise indicating your assent to these Terms, you agree to be bound by
      these Terms as an Authorised User of a Customer’s Subscription.
    </p>
    <p>
      In either case, you represent and warrant that (1) you have read,
      understand, and agree to be bound by these Terms, (2) you are at least 16
      years of age, and (3) you have the authority to enter into the Terms (on
      behalf of yourself or, if applicable, the Organisation that you
      represent). If you do not wish to be bound by these Terms, you may not
      access or use the Services. Our Services are not designed for users under
      the age of 16, and if you are younger than 16 you may not use the Service.
    </p>
    <p>
      These Terms incorporate by reference the Tabzo Privacy Policy available at{" "}
      <Link href="https://tabzo.app/policies/privacy">
        https://tabzo.app/policies/privacy
      </Link>
      .
    </p>
    <h2>3. Changes to the Terms</h2>
    <p>
      These Terms are subject to occasional revision. We will notify you of any
      changes to our Terms by posting the new Terms on the Services and updating
      the “Last Updated” date. We will also notify you of material changes by
      sending an email to the email address you have provided to us. For
      existing Customers and Authorised Users, any changes to these Terms will
      be effective thirty (30) calendar days following notification of such
      change. For new Customers and Authorised Users entering into these Terms
      after the new “Last Updated” date, these changes will be effective
      immediately. Continued use of the Services following such changes will
      indicate your acknowledgement of such changes and agreement to be bound by
      the updated version of these Terms.
    </p>
    <h2>4. Access to the Service</h2>

    <p>
      A Customer may enter into an agreement with Tabzo to purchase a
      subscription to access and use the Service, subject to these Terms (a
      “Subscription”). Tabzo may, in its sole discretion, also offer Customers
      the ability to access and use the Service without payment (the Free tier),
      subject to these Terms (an “Unpaid Subscription”).
    </p>
    <p>
      Tabzo may terminate any Unpaid Subscription at any time, in its sole
      discretion, without liability to the applicable Customer or any Authorised
      User. In the case of a paid Subscription, Customer and its Authorised
      Users will be permitted to access and use the Service for the period set
      forth in such Subscription. In all events, we may modify, suspend, or
      discontinue parts of the Services from time to time. Where reasonably
      practicable, we will provide advance notice of material changes. If you
      object to any such modifications, your sole recourse will be to cease
      access to the Services.
    </p>
    <h2>5. Use of the Services</h2>
    <ol>
      <li>
        In order to access certain features of the Service (especially cloud
        sync, unlimited workspaces, the Index-0 Workspace Dashboard, markdown
        notes, micro-tasks and Team features), you may be required to provide
        information about yourself (such as identification or contact details).
        It is your responsibility to ensure that such information is accurate
        and up to date.
      </li>
      <li>
        You agree to use the Services only for purposes that are (a) permitted
        by the Terms and (b) in compliance with all applicable laws, rules and
        regulations.
      </li>
      <li>
        You agree not to access (or attempt to access) the Service through any
        automated means (including use of scripts, bots or web crawlers) except
        as expressly permitted by us, and shall ensure that you comply with the
        instructions set out in any robots.txt file present on the Services.
      </li>
      <li>
        You agree that you will not engage in any activity that interferes with
        or disrupts the Service (or the servers and networks which are connected
        to the Service).
      </li>
      <li>
        You agree that you will not reproduce, duplicate, copy, attempt to
        create a substitute or similar service through use of or access to,
        sell, trade or resell the Services for any purpose.
      </li>
      <li>
        You agree that you will not (and you will not permit anyone else to)
        copy, modify, create a derivative work of, reverse engineer, decompile
        or otherwise attempt to extract the source code of the Services or any
        part thereof, unless this is expressly permitted or required by law.
      </li>
      <li>
        You agree that you are responsible for your own conduct and Content
        while using the Services and for any consequences thereof.
      </li>
      <li>
        You agree to maintain the confidentiality and security of your password
        and any other account information. You agree to notify Tabzo immediately
        at <a href="mailto:support@tabzo.app">support@tabzo.app</a> if you
        become aware of any unauthorised use of your password or of your
        account.
      </li>
      <li>
        You agree that for each Customer account, certain users assigned by
        Customer (“Admin Users”) may have administrative privileges which can
        access and modify Content on the Service, and may remove your ability to
        access the Customer account and such Content. You agree that Tabzo will
        have no liability to you for actions taken by Admin Users.
      </li>
      <li>
        <strong> Browser-specific warnings.</strong> Tabzo operates as a browser
        extension (primarily for Google Chrome and Chromium-based browsers)
        together with a web-based dashboard. You acknowledge and agree that:
        <ul>
          <li>
            Free-tier workspaces are primarily stored in your browser and may be
            associated with an anonymous identifier for limited backup
            functionality. Clearing browser data, uninstalling the extension,
            switching browsers or devices, or using private/incognito mode may
            result in permanent loss of Free-tier workspaces. Tabzo has no
            ability to recover local-only data.
          </li>
          <li>
            Restoring a workspace opens a standard browser window. Tabzo does
            not control or guarantee the behaviour of third-party websites,
            extensions, or browser updates that may affect tab restoration,
            window titles, or the Index-0 Workspace Dashboard.
          </li>
          <li>
            Claims regarding RAM savings are approximate and depend on your
            system, number of tabs, browser version and other running processes.
            Tabzo does not guarantee any specific performance improvement.
          </li>
          <li>
            The “Remote Control” inter-operability feature and pinned Index-0
            dashboard require an active internet connection and a valid paid
            Subscription. They may be unavailable during network interruptions
            or planned maintenance.
          </li>
          <li>
            You remain solely responsible for the security of any sensitive
            information (API keys, credentials, notes) that you store in
            markdown pads or workspaces.
          </li>
          <li>
            Suspending, freezing, closing, or restoring browser tabs may cause
            the loss of unsaved form entries, draft content, session data, or
            other temporary information stored by third-party websites. Tabzo
            stores workspace metadata, browser state, and URLs, but does not
            preserve the internal state or unsaved content of external websites.
            You are responsible for saving your work before using features that
            suspend or restore browser tabs.
          </li>
          <li>
            Users are responsible for maintaining their own backups of important
            data. Although Tabzo may provide export functionality, we do not
            guarantee that exported data will remain compatible with future
            versions of the Services or third-party software.
          </li>
        </ul>
      </li>
    </ol>
    <h2>6. Organisation Accounts</h2>
    <p>
      If the domain of the primary email address associated with your account is
      determined by Tabzo to be owned by an Organisation, then some of your
      account information (such as your username) may automatically be visible
      to other users who have registered with email addresses with the same
      domain.
    </p>
    <p>
      If an authorised representative of the Organisation that owns the domain
      of the primary email address associated with your account wishes to
      purchase a Subscription and add you to its account, then certain
      information concerning your existing account will become accessible to
      that Organisation’s Admin Users, including your name and email address,
      and your account and related Content may be added to the Organisation’s
      account.
    </p>
    <p>
      If you do not intend to share such information and Content as described in
      this Section 6, then you must create your account using a personal email
      address instead of an email address owned by an Organisation. If you
      believe Tabzo has incorrectly identified your email address as being owned
      by an Organisation, please notify us at{" "}
      <a href="mailto:support@tabzo.app">support@tabzo.app</a>.
    </p>
    <h2>7. Billing and Payment</h2>
    <p>
      For each paid Subscription (Solo Pro or Team/Agency), Tabzo will bill the
      Customer in advance for use of the Services in the amount and on the
      frequency indicated at the time of purchase. Tabzo reserves the right to
      modify pricing at any time, subject to compliance with the terms of any
      existing Subscriptions for the term thereof, in which case price increases
      during such term will go into effect upon renewal of the Subscription. If
      a Customer upgrades to a higher pricing level or tier, Tabzo will credit
      any remaining balance from previous Subscription payment to the new level
      or tier.{" "}
      <strong>All fees paid for a Subscription are non-refundable</strong>,
      except where mandatory consumer protection law provides otherwise.
    </p>
    <p>
      Each Customer agrees to maintain valid and up-to-date payment method
      information on file with Tabzo. Customer may update this billing
      information at any time in the settings on its account.
    </p>
    <p>
      All payments due are in the currency indicated at checkout unless
      otherwise agreed in writing by Tabzo. Payments are due upon commencement
      of the Subscription and each renewal thereafter. Tabzo may suspend,
      downgrade or terminate Customer’s account if fees are not paid when due.
    </p>
    <p>
      At the end of each Subscription term, such Subscription will automatically
      renew for successive terms equal to the original Subscription term, unless
      Customer terminates the Subscription prior to such renewal via the account
      interface or by notifying us at{" "}
      <a href="mailto:support@tabzo.app">support@tabzo.app</a>.
    </p>
    <p>
      Customer is responsible for any applicable taxes, duties and similar
      charges associated with its Subscription (other than Tabzo’s own taxes).
      If Tabzo is obligated to collect or pay such taxes, they will be added to
      the invoice or charged at checkout where required by law.
    </p>
    <h2>8. Content in the Services</h2>
    <p>
      You understand that all information, workspace data, tab URL lists, window
      titles, markdown notes, micro-task lists and other content which you may
      have access to as part of, or through your use of, the Services (the
      “Content”) is the sole responsibility of the person from which such
      Content originated. By using the Services you may be exposed to Content
      that you may find offensive, indecent or objectionable and that, in this
      respect, you use the Services at your own risk.
    </p>
    <p>
      Tabzo may review or remove Content where reasonably necessary to comply
      with applicable law, investigate abuse, enforce these Terms, protect the
      security of the Services, or as otherwise described in our Privacy Policy.
      You agree that you are solely responsible for any Content that you create,
      transmit, store or display while using the Services and for the
      consequences of your actions (including any loss or damage which Tabzo may
      suffer) by doing so.
    </p>
    <h2>9. Proprietary Rights</h2>
    <p>
      You acknowledge and agree that Tabzo owns and retains all legal right,
      title and interest in and to the Services, including all intellectual
      property rights related thereto (whether registered or unregistered, and
      wherever in the world those rights may exist). You further acknowledge
      that the Services may contain information which is designated confidential
      by Tabzo and that you shall not disclose such information without Tabzo’s
      prior written consent.
    </p>
    <p>
      Tabzo hereby grants you a personal, worldwide, royalty-free,
      non-sublicensable, non-assignable, non-exclusive, non-transferable and
      revocable licence to access and use the Services in compliance with these
      Terms. You acknowledge and agree that you obtain no intellectual property
      rights under these Terms, except for the limited licence explicitly
      contained herein.
    </p>
    <p>
      {" "}
      You retain copyright and any other rights you already hold in Content
      which you submit, share, upload, post or display on or through the
      Services (including workspace configurations, tab URL lists, markdown
      notes and micro-task lists). You hereby grant Tabzo a limited licence to
      use your Content to provide the Services, including the right to access,
      use, process, reproduce, adapt, modify, translate, publish and distribute
      Content (a) as requested by you or a User; (b) as necessary to manage
      accounts, provide support, sync workspaces across devices (for paid
      plans), and provide and improve the Services, including to identify,
      investigate or resolve technical or security problems and to detect and
      protect against fraud; and (c) as required by applicable law, regulation,
      legal process or enforceable governmental request and to detect and
      prevent violations of these Terms.
    </p>
    <p>
      Tabzo may anonymise and aggregate your Content (as so anonymised and
      aggregated, the “Anonymised Content”) for the purpose of analysing and
      improving the performance of the Service, producing aggregated statistics,
      conducting analytics, and otherwise operating its business. You hereby
      grant Tabzo a worldwide, non-exclusive, royalty-free licence to use, copy,
      reproduce, distribute, prepare derivative works of, display and perform
      any and all Anonymised Content for such purposes, provided that no such
      use of the Anonymised Content identifies Customer or any Authorised User.
    </p>

    <p>
      You represent and warrant to Tabzo that you have all the rights, power and
      authority necessary to grant the above licences. You agree that you will
      not submit, share, upload, post or display Content on or through the
      Service that is copyrighted, protected by trade secret or otherwise
      subject to third-party proprietary rights, including privacy and publicity
      rights, unless you are the owner of such rights or have permission from
      their rightful owner to submit, share, upload, post or display the Content
      and to grant Tabzo all of the licence rights granted herein.
    </p>

    <p>
      <strong> Feedback</strong>. If you provide Tabzo with any suggestions,
      ideas, enhancement requests, recommendations, or other feedback relating
      to the Services ("Feedback"), you grant Tabzo a worldwide, perpetual,
      irrevocable, non-exclusive, royalty-free license to use, reproduce,
      modify, incorporate, and otherwise exploit such Feedback for any purpose
      without restriction or compensation to you.
    </p>

    <h2>10. Termination</h2>
    <p>
      These Terms will continue to apply until terminated by either you or Tabzo
      as set out below.
    </p>
    <p>
      Either party may terminate any Subscription in the event that the other
      party materially breaches these Terms and does not cure such breach within
      30 days after receipt of written notice thereof.
    </p>
    <p>
      A Customer may terminate a Subscription at any time (a) by notifying Tabzo
      at <a href="mailto:support@tabzo.app">support@tabzo.app</a> or (b) via the
      interface provided as part of the Services in your web dashboard. Except
      where mandatory consumer protection law provides otherwise, Customer will
      not be entitled to a refund of prepaid but unused fees.
    </p>
    <p>
      An Authorised User may terminate these Terms at any time (a) by notifying
      Tabzo at <a href="mailto:support@tabzo.app">support@tabzo.app</a> or (b)
      via the interface provided as part of the Services.
    </p>
    <p>
      Tabzo may terminate these Terms or any Subscription at any time if: (a)
      Customer or any Authorised User has breached any provision of the Terms
      (or has acted in a manner which clearly shows that you do not intend to,
      or are unable to comply with the provisions of the Terms); (b) Tabzo is
      required to do so by law; (c) Tabzo is transitioning to no longer
      providing the Services to users in the area in which you are resident or
      from which you use the service; or (d) if the provision of the Services to
      you by Tabzo is, in Tabzo’s sole opinion, no longer commercially viable.
    </p>
    <p>
      Tabzo may terminate any Unpaid Subscription (Free tier) at any time with
      or without notice.
    </p>
    <p>
      Upon termination of these Terms or any Subscription, all of the legal
      rights, obligations and liabilities under these Terms arising prior to
      such termination or which are expressed to continue indefinitely shall
      survive such termination indefinitely. After termination of a paid
      Subscription, Tabzo may delete cloud-synced content in accordance with our{" "}
      <Link href="/policies/privacy">Privacy Policy</Link> and data retention
      practices. Free-tier data stored solely in local browser storage remains
      under your control and is not accessible to Tabzo.
    </p>
    <p>
      Before terminating your account or Subscription, you are responsible for
      exporting or otherwise backing up any Content you wish to retain. Although
      Tabzo may provide export functionality, we do not guarantee the continued
      availability of export features or that exported data will remain
      compatible with future versions of the Services or third-party software.
    </p>
    <h2>11. Exclusion of Warranties</h2>
    <p>
      The Services are provided on an &ldquo;as-is&rdquo; and
      &ldquo;as-available&rdquo; basis. Tabzo makes no representations or
      warranties of any kind, whether express or implied, as to the operation of
      the Services, including but not limited to any warranties of
      merchantability, fitness for a particular use or purpose,
      non-infringement, quiet enjoyment or accuracy.{" "}
      <strong>
        You expressly agree that your use of the Services is at your sole risk.
      </strong>{" "}
      Tabzo makes no warranty that the Services will meet your requirements, or
      that your access to the Services will be uninterrupted, timely, secure,
      error-free or free of viruses or bugs; nor does Tabzo make any warranty as
      to the results that may be obtained from the use of the Services
      (including any claims regarding RAM savings, productivity improvements,
      workspace reliability or tab restoration accuracy).
    </p>

    <p>
      To the extent that Tabzo may not, as a matter of applicable law, disclaim
      any implied warranty, the scope and duration of such warranty will be
      limited to the maximum extent permitted under such applicable law.
    </p>
    <h2>12. Limitation of Liability</h2>
    <p>
      In no event will Tabzo be liable for any indirect, incidental,
      consequential, special, punitive or exemplary damages, including lost
      profits, loss of use, loss of data, cost of procurement of substitute
      goods or services, however caused, and on any theory of liability, whether
      for breach of contract, tort (including negligence and strict liability)
      or otherwise, whether or not Tabzo has been advised of the possibility of
      such damages.
    </p>

    <p>
      In no event shall Tabzo&rsquo;s aggregate liability arising out of or
      relating to the Services exceed the greater of:
      <ul>
        <li>
          EUR 100 (or the equivalent in your local currency) for any single
          incident or claim;
        </li>
        <li>
          The total fees paid by you to Tabzo during the twelve (12) months
          preceding the event giving rise to the claim.
        </li>
      </ul>
    </p>
    <p>
      To the extent that Tabzo may not, as a matter of applicable law, limit
      liabilities, the extent of tabzo&rsquo;s liability will be the minimum
      permitted under such applicable law.
    </p>
    <p>
      Nothing in these Terms excludes or limits liability for death or personal
      injury caused by negligence, fraud or fraudulent misrepresentation, or any
      other liability that cannot be excluded or limited by applicable law.
    </p>
    <h2>13. Indemnification</h2>
    <p>
      You hereby agree to indemnify, defend and hold Tabzo, its partners,
      officers, directors, agents, affiliates and licensors (the “Indemnified
      Parties”) harmless from and against any claim or liability arising out of:
      <ul>
        <li>
          Any Content you submit, share, upload, post or display on or to the
          Service
        </li>
        <li>Any use by Tabzo end users of your Content</li>
        <li>
          Any breach of or non-compliance with any representation, warranty or
          obligation in these Terms or applicable policies
        </li>
        <li>
          Any claim that your Content violates any applicable law, including
          without limitation that it infringes the rights of a third party
        </li>
      </ul>
      You shall cooperate fully in the defence of any claim. Tabzo reserves the
      right, at its own expense, to assume the exclusive defence and control of
      any matter subject to indemnification by you.
    </p>
    <h2>14. Intellectual Property Complaints</h2>
    <li>
      Tabzo does not permit infringement of intellectual property rights on its
      Services. Tabzo may remove Content if it believes or has reason to believe
      such Content infringes another’s intellectual property rights. Without
      prior notice and at any time at its sole discretion, Tabzo reserves the
      right to remove any Content, disable your ability to share or upload
      Content within the Service, or terminate your access to the Service (a)
      for uploading or sharing such Content in violation of these Terms; or (b)
      if, under appropriate circumstances, you are determined to be a repeat
      infringer.
    </li>
    <li>
      If you believe that Content available through the Services infringes your
      intellectual property rights, please contact us at support@tabzo.app with
      sufficient detail to allow us to investigate the claim.
    </li>
    <h2>15. General Legal Terms</h2>
    <ol>
      <li>
        The Terms constitute the entire legal agreement between you and Tabzo
        and govern your use of the Services, and completely replace any prior
        agreements between you and Tabzo in relation to the Services.
      </li>
      <li>
        You agree that if Tabzo does not exercise or enforce any legal right or
        remedy which is contained in the Terms (or which Tabzo has the benefit
        of under any applicable law), this will not be taken to be a waiver of
        Tabzo’s rights and that those rights or remedies will still be available
        to Tabzo
      </li>
      <li>
        If any court of law having the jurisdiction to decide on this matter
        rules that any provision of these Terms is invalid, then that provision
        will be removed from the Terms without affecting the rest of the Terms.
        The remaining provisions of the Terms will continue to be valid and
        enforceable.
      </li>
      <li>
        The Terms, and your relationship with Tabzo under the Terms, shall be
        governed by the laws of Romania. You and Tabzo agree to submit to the
        exclusive jurisdiction of the competent courts of Romania to resolve any
        legal matter arising from the Terms. Notwithstanding this, Tabzo shall
        still be allowed to apply for interim or conservatory measures (or an
        equivalent type of urgent legal relief) in any jurisdiction.
      </li>
      <li>
        Assignment. You may not assign or transfer these Terms or any rights
        under them without Tabzo's prior written consent. Tabzo may assign these
        Terms in connection with a merger, acquisition, corporate
        reorganization, or sale of assets.
      </li>

      <li>
        For any questions regarding these Terms, please contact us at{" "}
        <a href="mailto:support@tabzo.app">support@tabzo.app</a> or via the
        contact form available at
        <Link href="https://tabzo.app/contact">https://tabzo.app/contact</Link>.
      </li>
      <li>
        Force Majeure. Neither party shall be liable for any delay or failure to
        perform its obligations under these Terms to the extent caused by events
        beyond its reasonable control, including natural disasters, acts of
        government, war, terrorism, civil unrest, labor disputes, internet or
        telecommunications outages, failures of third-party infrastructure
        providers, or other events of a similar nature. This provision does not
        relieve either party of any payment obligations that accrued prior to
        such event.
      </li>
    </ol>
    <h2>16. Contact Information</h2>
    <ul>
      <li>
        <strong>Support Email:</strong>{" "}
        <a href="mailto:support@tabzo.app">support@tabzo.app</a>
      </li>
      <li>
        <strong>Official Website Contact Page:</strong>{" "}
        <a href="https://tabzo.app/contact">https://tabzo.app/contact</a>
      </li>
    </ul>
  </div>
);

export default TermsAndConditionsPage;
