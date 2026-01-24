'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] to-[#F5EFE6]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#8B6F47] bg-[#8B6F47]/10 inline-block px-3 py-1 rounded">TERMS OF SERVICE</h1>
          <p className="text-[#A67A5B]/70 mt-4">Last Updated: January 24, 2026</p>
        </div>

        {/* Introduction */}
        <div className="prose prose-stone max-w-none text-[#5a4a3a]">
          <p className="mb-6">
            Please read these Terms of Service (these "<strong>Terms</strong>") carefully, as they constitute a legally binding agreement between HelloML ("<strong>HelloML</strong>," "<strong>we</strong>," "<strong>us</strong>" or "<strong>our</strong>") and an end-user and any employees, agents, contractors and any other entity on whose behalf the end-user accepts these terms (collectively, "<strong>you</strong>" and "<strong>your</strong>") and apply to your use of our website and Services (as defined below). In case you are utilizing the Services as a representative of a party (e.g. your employer or customer, collectively the "<strong>Client</strong>"), your acceptance of these Terms also binds the Client.
          </p>

          <p className="mb-6">
            This is a binding agreement. If you use the Services or click accept or agree to these Terms if presented to you in a user interface for the Services, or you have signed a subscription agreement that serves as a master agreement, you are legally bound by the obligations in these Terms. If you are entering into these Terms on behalf of a Client, you represent and warrant that you have the authority to bind the Client to these Terms, and any reference to "you" and "your" will refer and apply to that party. If you do not agree to all of these Terms, you shall not use the Service and you should not set up an Account (as defined).
          </p>

          <p className="mb-6">
            By agreeing to these Terms, you expressly agree that except for limited circumstances, the parties will only resolve disputes by arbitration, solely on an individual basis.
          </p>

          {/* Table of Contents */}
          <h2 id="toc" className="text-2xl font-bold text-[#8B6F47] mt-12 mb-6">TABLE OF CONTENTS</h2>

          <ol className="list-decimal pl-6 mb-8 space-y-1 text-[#8B6F47]">
            <li><a href="#section1" className="hover:underline">Acceptance of these Terms</a></li>
            <li><a href="#section2" className="hover:underline">Using the Services</a></li>
            <li><a href="#section3" className="hover:underline">Creating an Account</a></li>
            <li><a href="#section4" className="hover:underline">Intellectual Property Rights, Ownership and Grants</a></li>
            <li><a href="#section5" className="hover:underline">Aggregate Statistics</a></li>
            <li><a href="#section6" className="hover:underline">Communications</a></li>
            <li><a href="#section7" className="hover:underline">Term and Termination</a></li>
            <li><a href="#section8" className="hover:underline">Changes to Terms</a></li>
            <li><a href="#section9" className="hover:underline">Indemnity</a></li>
            <li><a href="#section10" className="hover:underline">Disclaimer of Warranties and Conditions</a></li>
            <li><a href="#section11" className="hover:underline">Limitation of Liability</a></li>
            <li><a href="#section12" className="hover:underline">Governing Law and Dispute Resolution</a></li>
            <li><a href="#section13" className="hover:underline">International Use</a></li>
            <li><a href="#section14" className="hover:underline">Severability, Waiver</a></li>
            <li><a href="#section15" className="hover:underline">Export Control</a></li>
            <li><a href="#section16" className="hover:underline">Notice</a></li>
            <li><a href="#section17" className="hover:underline">Assignment</a></li>
            <li><a href="#section18" className="hover:underline">Force Majeure</a></li>
            <li><a href="#section19" className="hover:underline">Final Terms</a></li>
            <li><a href="#section20" className="hover:underline">Contact Us</a></li>
          </ol>

          {/* Section 1 */}
          <h2 id="section1" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">1. ACCEPTANCE OF THESE TERMS</h2>

          <p className="mb-4">
            You hereby agree to accept these Terms by opening an account under a username, notwithstanding any existing services agreement to which you may also be signatory which incorporated these Terms by reference.
          </p>

          <p className="mb-4">
            You also agree to abide by other HelloML rules and policies, including our <Link href="/privacy" className="text-[#8B6F47] underline">Privacy Policy</Link> (which explains what information we collect from you and how we protect it) that are expressly incorporated into and are a part of these Terms. Please read them carefully.
          </p>

          <p className="mb-6">
            Once you accept these Terms you are bound by them until they are terminated. See Section 7 (Term and Termination).
          </p>

          {/* Section 2 */}
          <h2 id="section2" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">2. USING THE SERVICES</h2>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">a. Right to Use and License</h3>

          <p className="mb-4">
            Subject to your compliance with these Terms, HelloML hereby grants you a non-exclusive, non-transferable, non-assignable, non-sublicensable, and revocable right to use the Services, solely for the purposes of utilizing the Service to deploy AI voice agents and solely in the manner described in these Terms and in any technical documentation contained in, or provided with, the Services.
          </p>

          <p className="mb-4">
            You acknowledge and agree that you are only being granted a right to use the Services and nothing is being sold to you. You do not acquire any ownership interest in the Services under these Terms, or any other rights thereto, other than to use the Service in accordance with the use rights specified and other terms, conditions, and restrictions of these Terms. We reserve all other rights that are not granted in these Terms.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">b. What We Provide</h3>

          <p className="mb-4">
            The Services include but are not limited to a hosted software solution ("<strong>Platform</strong>") that allows you to create AI voice agents that can interact with your customers and stakeholders and respond to queries by such individuals in a realistic and conversational manner.
          </p>

          <p className="mb-4">
            Our Platform provides an orchestration layer that allows you to, either via our API or via the Dashboard, utilize transcription services, process speech through large language models ("<strong>LLM</strong>" or "<strong>AI Model</strong>") to generate responses, and convert text to speech to be delivered to stakeholders (the Platform and additional features, such as phone numbers that connect to our Platform, collectively, the "<strong>Services</strong>").
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">c. Third-Parties</h3>

          <p className="mb-4">
            Our Services interact with third-party service providers (our "<strong>Providers</strong>") as part of Services. You understand and agree that when you use the various aspects of the Services (i.e. transcription, LLM processing, and voice generation), we may share Your Content (as defined) with each Provider, subject to each Provider's individual terms and conditions. We do not make any representation and warranties on any Provider's behalf, nor are we an agent of any such Provider.
          </p>

          <p className="mb-4">
            You may in certain instances need to have separate subscriptions with our Providers. Please review the specific terms of service or equivalent agreement which apply to the Provider that you elect to utilize.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">d. Use Restrictions</h3>

          <p className="mb-4">
            You agree to not, directly or indirectly (and will not permit any third party) to:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Do anything with the Services other than use them for your own use as intended under these Terms, including not to license, sell, rent, lease, transfer, assign, reproduce, distribute, host or otherwise commercially exploit the Services or any portion of the Services;</li>
            <li>Use the Services in any way that would violate applicable law or otherwise give rise to criminal or civil liability;</li>
            <li>Create AI voice agents using our Services for any illegal purpose;</li>
            <li>Use HelloML's name, trademarks, service marks, trade names, designs, logos, photos, or any other materials we make available via the Services, except as allowed by these Terms;</li>
            <li>Remove, alter or destroy any copyright notices or other proprietary markings contained on or in the Services or infringe HelloML's Intellectual Property Rights;</li>
            <li>Copy, modify, translate, adapt, merge, archive, download, upload, disclose, distribute, sell, lease, syndicate, broadcast, perform, display, make available, make derivatives of, or otherwise use the Services or its content, other than as expressly permitted by these Terms;</li>
            <li>Reverse engineer, duplicate, decompile, disassemble, or decode any part of the software we provide or the Services;</li>
            <li>Use any robot, spider, crawler, scraper, or other automated means to access the Services or extract data;</li>
            <li>Upload viruses or other malicious code or otherwise compromise the security of the Services;</li>
            <li>Disrupt or hinder any of the Service's systems, servers, or networks;</li>
            <li>Try to detect, scan, or test any vulnerabilities of the Services or breach any security protections;</li>
            <li>Pretend to be someone else or falsely represent your association with any entity;</li>
            <li>Access the Service in ways that are not authorized by these Terms;</li>
            <li>Leverage the Service to produce datasets for neural network training, machine modeling, or developing products for third parties;</li>
            <li>Use the Services in a manner that violates the Health Insurance Portability and Accountability Act (HIPAA) or the Payment Card Industry Data Security Standard (PCI DSS) without properly configuring the appropriate compliance settings within the Services.</li>
          </ul>

          <p className="mb-4">
            In all cases, HelloML will determine in our sole discretion whether any action of an end-user violates the above rules. Violation of the above rules is a breach of these Terms.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">e. Service Updates</h3>

          <p className="mb-4">
            You understand that the Services will evolve from time to time. You acknowledge and agree that HelloML may update the Services with or without notifying you, including adding or removing features, products, or functionalities.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">f. Fees</h3>

          <p className="mb-6">
            Usage of our Services is subject to the fees that are set out on our website. The fees you pay will be directly correlated with the amount of voice minutes processed through HelloML. Nothing prevents us from revising the fees charged for our Services, or introducing new features and benefits and charging additional amounts. Your costs under any subscription to our Services will not change until your then current term of subscription ends.
          </p>

          {/* Section 3 */}
          <h2 id="section3" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">3. CREATING AN ACCOUNT</h2>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">a. Registration</h3>

          <p className="mb-4">
            To access the Services, you must register and obtain login credentials for an account ("<strong>Account</strong>") and provide information as prompted by the account registration flow. You represent and warrant that: (a) all registration information you submit is truthful and accurate; and (b) you will maintain and promptly update such information to keep it true, accurate, current and complete. You may delete your Account at any time, for any reason in accordance with Section 7(b).
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">b. Eligibility</h3>

          <p className="mb-4">
            The Services are only available to end-users who can form legally binding contracts under applicable law. By accessing or using the Services, you represent and warrant that you are at least 18 years of age or over the age of majority in the state or country where you are a resident or citizen. You are not eligible to be a Client or an end-user if you are barred from using the Services under the laws of the United States or any other applicable jurisdiction, including pursuant to Section 15 (Export Control) in these Terms.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">c. User Information & Credentials</h3>

          <p className="mb-6">
            When you create an Account with HelloML, you will be asked to choose a username and password. You acknowledge and agree that you are exclusively responsible for the security and confidentiality of your login credentials and for all use of the Services and all related charges that may arise from such use. You may not share your Account or password with anyone, and you agree to notify HelloML immediately of any actual or suspected unauthorized use of your Account or any other breach of security. Each end user must maintain their own credentials.
          </p>

          {/* Section 4 */}
          <h2 id="section4" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">4. INTELLECTUAL PROPERTY RIGHTS, OWNERSHIP AND GRANTS</h2>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">a. Your Content</h3>

          <p className="mb-4">
            When you utilize our Service, all materials uploaded to or transmitted via the Platform is your content ("<strong>Your Content</strong>"). You own all rights and title in Your Content, including any Intellectual Property Rights. HelloML does not claim any ownership of Your Content or assert any rights under your Intellectual Property Rights other than as granted under these Terms.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">b. Rights You Grant Us</h3>

          <p className="mb-4">
            You hereby grant HelloML a worldwide, royalty-free, sublicensable license to host, store, cache, use, display, reproduce, modify, adapt, edit, analyze, transmit, and distribute ("<strong>Handle</strong>") Your Content during the Term. This license to Handle is solely for the purpose of us and our Providers providing you the Services.
          </p>

          <p className="mb-4">
            We do not utilize Your Content to obtain any customer specific intelligence. Our scope of use of data is only for purposes of enhancing call features, latency and the performance of your AI voice agents, and does not in any way relate to capturing and using personal information of any caller or any information/inputs of a caller in respect of your business.
          </p>

          <p className="mb-4">
            You agree that submission of any ideas, suggestions, documents, and/or proposals to HelloML ("<strong>Feedback</strong>") is at your own risk and that HelloML has no obligations (including without limitation obligations of confidentiality) with respect to such Feedback. You hereby grant to HelloML a fully paid, royalty-free, perpetual, irrevocable, worldwide, non-exclusive, and fully sublicensable and transferable right and license to use, reproduce, perform, display, distribute, adapt, modify, re-format, create derivative works of, and otherwise commercially or non-commercially exploit in any manner, any and all Feedback for any purpose.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">c. HelloML's Rights</h3>

          <p className="mb-4">
            The Services utilize technology and capabilities and contain certain materials provided by us as well as our licensors, including but not limited to, all proprietary LLM, content, information, software, images, text, graphics, illustrations, logos, and (as applicable) audio and video. HelloML and its licensors reserve all ownership and Intellectual Property Rights to all parts of our Services.
          </p>

          <p className="mb-4">
            For the purposes of these Terms, "<strong>Intellectual Property Rights</strong>" means all (i) patents, patent disclosures, and inventions (whether patentable or not), (ii) trademarks, (iii) copyrights and copyrightable works (including computer programs), and rights in data and databases, and (iv) all other intellectual property rights, in each case whether registered or unregistered and including all applications for, and renewals or extensions of, such rights.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">d. Rights Granted to Third Parties</h3>

          <p className="mb-6">
            Providers that deliver part of our Services require rights to Handle Your Content as applicable to the service they provide. Each Provider has its own contractual terms that apply. Please review the specific terms of service which apply to the Provider that you elect to utilize. While we expect each Provider to comply with their privacy policies and contractual obligations, we do not monitor nor make any guarantees or warranties in respect of their compliance.
          </p>

          {/* Section 5 */}
          <h2 id="section5" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">5. AGGREGATE STATISTICS</h2>

          <p className="mb-6">
            HelloML shall monitor your use of the Services, including the Platform, and collect and compile data and information related to all such use in an aggregate and anonymized manner, including to compile statistical and performance information related to the provision and operation of the Platform ("<strong>Aggregated Statistics</strong>"). Such Aggregated Statistics are wholly owned by HelloML with all rights reserved and may be used for operating, developing, providing, promoting, and improving the Services.
          </p>

          {/* Section 6 */}
          <h2 id="section6" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">6. COMMUNICATIONS</h2>

          <p className="mb-6">
            By entering into these Terms or using the Services, you agree to receive communications from us, including via email, and/or push notifications. Communications from us may include, but are not limited to, operational communications concerning your Account or the use of the Services, updates concerning new and existing features on the Services, and news concerning HelloML and industry developments.
          </p>

          {/* Section 7 */}
          <h2 id="section7" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">7. TERM AND TERMINATION</h2>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">a. Term</h3>

          <p className="mb-4">
            These Terms commence on the earlier of the date you first opened an Account to use the Services or the date when you accepted these Terms, and these Terms will remain in full force and effect while you use the Services, unless terminated earlier in accordance with this Section.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">b. Termination by HelloML</h3>

          <p className="mb-4">
            If you have breached any provision of these Terms, if HelloML is required to do so by law, or if it is commercially impracticable for HelloML to provide the Services, HelloML has the right to, immediately and without notice, suspend or terminate any of the Services provided to you.
          </p>

          <p className="mb-4">
            You agree that all terminations will be made in HelloML's sole discretion and that HelloML will not be liable to you or any third party for any termination of your Account, provided that if applicable, HelloML shall refund you any prepaid amount, on a pro-rata basis, for any duration of the term of subscription which remains after the termination of your Account.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">c. Termination by You</h3>

          <p className="mb-4">
            Other than the clauses which survive any expiry or termination of these Terms, these Terms shall not apply to you upon your notice to us requesting Services no longer be provided.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">d. Effect of Termination</h3>

          <p className="mb-4">
            If Services are terminated for any reason, your use rights shall cease and you may not be able to access your Account and all related information or files associated with or inside your Account may be deleted. HelloML will not have any liability whatsoever to you for any suspension or termination.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">e. Survival</h3>

          <p className="mb-6">
            The following Sections shall survive any termination of your use right: Sections 4(a), 4(b), 4(c), 4(d), 7(d), 9, 10, 11, 12, 14, 16, and 19.
          </p>

          {/* Section 8 */}
          <h2 id="section8" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">8. CHANGES TO TERMS</h2>

          <p className="mb-4">
            These Terms are subject to occasional revision by HelloML. When changes are made, HelloML will make a new copy of these Terms of Service available on the website. We will also update the date at the top of these Terms. If we make any substantial changes, and you have registered with us to create an Account, we will also send an email to you at the last e-mail address you provided to us to notify you.
          </p>

          <p className="mb-4">
            Any changes to these Terms will be effective immediately for new registered users of the Services and will be effective 30 days after posting notice of such changes on the website for existing registered users. HelloML may require you to provide consent to the updated Terms in a specified manner before further use of the Services is permitted.
          </p>

          <p className="mb-6 font-semibold">
            IF YOU DO NOT AGREE TO ANY CHANGES AFTER RECEIVING A NOTICE OF SUCH CHANGE(S), YOU WILL STOP USING THE SERVICES. OTHERWISE, YOUR CONTINUED USE OF THE SERVICES CONSTITUTES YOUR ACCEPTANCE OF SUCH CHANGES.
          </p>

          {/* Section 9 */}
          <h2 id="section9" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">9. INDEMNITY</h2>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">a. Your Indemnification Obligation</h3>

          <p className="mb-4">
            You agree, to the extent permitted by law, to indemnify, defend, and hold harmless HelloML, our directors, officers, stockholders, employees, licensors, providers, and agents ("<strong>HelloML Parties</strong>") from and against any and all claims, demands, losses, liabilities, damages, costs, and expenses (including reasonable attorneys' fees) (collectively, "<strong>Losses</strong>") due to, arising out of, or relating in any way to: (a) your access to or use of the Services; (b) your breach of these Terms, any rights of another party, or any applicable law or regulation, including but not limited to the Telephone Consumer Protection Act of 1991 (TCPA), the Telemarketing and Consumer Fraud and Abuse Prevention Act, and their implementing regulations; or (c) your negligence or willful misconduct.
          </p>

          <p className="mb-4">
            HelloML reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with HelloML in asserting any available defenses. You agree that the provisions in this section will survive any termination of your Account, these Terms and/or your access to the Services.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">b. Indemnification by HelloML</h3>

          <p className="mb-6">
            HelloML will defend, indemnify and hold harmless you and as applicable your officers, directors, employees, contractors and licensors (collectively, "<strong>Subscriber Indemnitees</strong>"), from and against any costs, damages (including reasonable attorneys' fees) that are awarded in final judgment against or paid in settlement in connection with any action or suit brought against a Subscriber Indemnitee by a third party based upon a third-party claim that (i) the Services, as provided by HelloML pursuant to these Terms (exclusive of any Your Content), infringe any Intellectual Property Rights or misappropriate any trade secret, or (ii) arises from or relate to the gross negligence, willful misconduct, fraud or more culpable acts or omissions of HelloML, violation of applicable law by HelloML, or any breach by HelloML of any of its representations or warranties hereunder.
          </p>

          {/* Section 10 */}
          <h2 id="section10" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">10. DISCLAIMER OF WARRANTIES AND CONDITIONS</h2>

          <p className="mb-4">
            a. You expressly understand and agree that, to the extent permitted by applicable law, your use of the Services is at your sole risk, and the Services are provided on an "<strong>AS IS</strong>" and "<strong>AS AVAILABLE</strong>" basis, with all faults. HelloML expressly disclaims all warranties, representations, and conditions of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.
          </p>

          <p className="mb-4">
            b. Except as explicitly provided hereunder, HelloML makes no representation, warranty, or condition with respect to the Services, including but not limited to, the quality, effectiveness, and other characteristics of the Services. HelloML makes no representation or warranty that the Services will be uninterrupted, error-free, or timely. The Services may be subject to delays, cancellations and other disruptions.
          </p>

          <p className="mb-4">
            c. No advice or information, whether oral or written, obtained from HelloML or through the Services will create any warranty not expressly made in these terms.
          </p>

          <p className="mb-6">
            d. Unless you have limited the traffic flow to certain limits, we do not stop incoming voice calls to our Platform. As such, you are responsible for payment of all the minutes utilized on our Platform, regardless of whether the voice traffic exceeded your contemplation.
          </p>

          {/* Section 11 */}
          <h2 id="section11" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">11. LIMITATION OF LIABILITY</h2>

          <p className="mb-4">
            <strong>a. Disclaimer of Certain Damages.</strong> TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL A PARTY BE LIABLE FOR ANY LOSS OF PROFITS, REVENUE OR DATA, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR DAMAGES OR COSTS DUE TO LOSS OF PRODUCTION OR USE, BUSINESS INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE GOODS OR SERVICE, IN EACH CASE WHETHER OR NOT THE PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE SERVICES.
          </p>

          <p className="mb-4">
            <strong>b. Cap on Liability.</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, EACH PARTY WILL NOT BE LIABLE BEYOND THE GREATER OF (i) $100 USD, (ii) THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE DATE OF THE ACTIVITY GIVING RISE TO THE CLAIM. THESE LIMITATIONS AND EXCLUSIONS REGARDING DAMAGES APPLY EVEN IF ANY REMEDY FAILS TO PROVIDE ADEQUATE COMPENSATION.
          </p>

          <p className="mb-6">
            SOME COUNTRIES, STATES, PROVINCES, OR OTHER JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OF LIABILITY AS STATED IN THIS SECTION, SO THE TERMS HEREIN MAY NOT FULLY APPLY TO YOU.
          </p>

          {/* Section 12 */}
          <h2 id="section12" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">12. GOVERNING LAW AND DISPUTE RESOLUTION</h2>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">a. Governing Law</h3>

          <p className="mb-4">
            These Terms and all related orders and subscriptions related hereto, and all matters arising out of or relating to these Terms, are governed by, and construed in accordance with, the laws of the State of California, without giving effect to the conflict of laws provisions thereof.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">b. Arbitration</h3>

          <p className="mb-4">
            You and HelloML agree that any controversy, allegation, or claim that arises out of or relates to the Service, these Terms, or any additional terms, whether heretofore or hereafter arising (collectively, a "<strong>Dispute</strong>") will be resolved by binding arbitration, rather than in court, except for: (1) any controversy, allegation, or claim that arises out of or relates to our actual or alleged intellectual property rights; (2) any claim related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; (3) any claim for equitable relief.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">c. Informal Dispute Resolution</h3>

          <p className="mb-4">
            You and HelloML agree that good faith informal efforts to resolve disputes can result in a prompt, low-cost and mutually beneficial outcome. You and HelloML therefore agree that before either party commences arbitration against the other, we will personally meet or confer telephonically or via videoconference, in a good faith effort to resolve informally any Dispute covered by this clause ("<strong>Informal Dispute Resolution Conference</strong>").
          </p>

          <p className="mb-4">
            The party initiating a Dispute must give notice to the other party in writing of its intent to initiate an Informal Dispute Resolution Conference ("<strong>Notice</strong>"), which will occur within 45 days after the other party receives such Notice, unless an extension is mutually agreed upon by the parties. Notice to HelloML that you intend to initiate an Informal Dispute Resolution Conference should be sent by email to <a href="mailto:noah@helloml.app?subject=Dispute%20Resolution" className="text-[#8B6F47] underline">noah@helloml.app</a>.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">d. Waiver of Jury Trial</h3>

          <p className="mb-4">
            YOU AND HELLOML HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY. You and HelloML are instead electing that all disputes will be resolved by arbitration under these Terms, except as set out under Section 12(b) above.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">e. Waiver of Class and Other Non-Individualized Relief</h3>

          <p className="mb-4">
            YOU AND HELLOML AGREE THAT EACH OF US MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS, AND THE PARTIES HEREBY WAIVE ALL RIGHTS TO HAVE ANY DISPUTE BE BROUGHT, HEARD, ADMINISTERED, RESOLVED, OR ARBITRATED ON A CLASS, COLLECTIVE, REPRESENTATIVE, OR MASS ACTION BASIS.
          </p>

          <h3 className="text-lg font-semibold text-[#5a4a3a] mt-6 mb-3">f. Rules and Forum</h3>

          <p className="mb-6">
            These Terms evidence a transaction involving interstate commerce; and notwithstanding any other provision in these Terms with respect to the applicable substantive law, the Federal Arbitration Act, 9 U.S.C. § 1 et seq., will govern the interpretation and enforcement of this Section 12 and any arbitration proceedings. If the Informal Dispute Resolution Process described above does not resolve satisfactorily within sixty (60) days after receipt of your Notice, you and HelloML agree that either party will have the right to finally resolve the Dispute through binding arbitration. The arbitration will be administered by the American Arbitration Association ("<strong>AAA</strong>"), in accordance with the AAA Commercial Arbitration Rules then in effect, by one arbitrator alone and such arbitrator will have exclusive authority to resolve any dispute.
          </p>

          {/* Section 13 */}
          <h2 id="section13" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">13. INTERNATIONAL USE</h2>

          <p className="mb-6">
            The Services can be accessed from countries around the world and may contain references to features and services that are not available in your country. HelloML makes no representations that the Services are appropriate or available for use in other locations. Those who access or use the Services from other countries do so at their own volition and are responsible for compliance with local laws. If you are using the Services and are not in the United States, you agree that the location for dispute resolution is acceptable to you and that you will not challenge the forum as being inconvenient for you.
          </p>

          {/* Section 14 */}
          <h2 id="section14" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">14. SEVERABILITY, WAIVER</h2>

          <p className="mb-6">
            If any provision of these Terms is found unenforceable, then that provision will be severed from these Terms and not affect the validity and enforceability of any remaining provisions. Any waiver or failure to enforce any provision of these Terms on one occasion will not be deemed a waiver of any other provision or of such provision on any other occasion.
          </p>

          {/* Section 15 */}
          <h2 id="section15" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">15. EXPORT CONTROL</h2>

          <p className="mb-6">
            You may not use, export, import, or transfer the Services except as authorized by U.S. law, the laws of the jurisdiction in which you obtained the Services, and any other applicable laws. In particular, but without limitation, the Services may not be exported or re-exported (a) into any United States embargoed countries, or (b) to anyone on the U.S. Treasury Department's list of Specially Designated Nationals or the U.S. Department of Commerce's Denied Person's List or Entity List. By using the Services, you represent and warrant that (i) you are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a "terrorist supporting" country and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties.
          </p>

          {/* Section 16 */}
          <h2 id="section16" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">16. NOTICE</h2>

          <p className="mb-6">
            All notices required or permitted under these Terms will be in writing, will reference these Terms, and will be deemed given: (i) when delivered personally; (ii) one business day after deposit with a nationally recognized express courier, with written confirmation of receipt; (iii) three business days after having been sent by registered or certified mail, return receipt requested, postage prepaid, or (iv) when sent by email, on the date the email was sent if sent during normal business hours of the receiving party, and on the next business day if sent after normal business hours of the receiving party. You may give notice to HelloML at the following email address: <a href="mailto:noah@helloml.app?subject=Legal%20Notice" className="text-[#8B6F47] underline">noah@helloml.app</a>
          </p>

          {/* Section 17 */}
          <h2 id="section17" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">17. ASSIGNMENT</h2>

          <p className="mb-6">
            These Terms, and your rights and obligations hereunder, may not be assigned, subcontracted, delegated or otherwise transferred by you without HelloML's prior written consent, and any attempted assignment, subcontract, delegation, or transfer in violation of the foregoing will be null and void. HelloML may assign these Terms and any other right or obligation to a party without any consent or notification requirement to you.
          </p>

          {/* Section 18 */}
          <h2 id="section18" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">18. FORCE MAJEURE</h2>

          <p className="mb-6">
            HelloML will not be liable for any delay or failure to perform resulting from causes outside its reasonable control, including, but not limited to, acts of God, war, terrorism, riots, embargos, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes or shortages of transportation facilities, fuel, energy, labor or materials.
          </p>

          {/* Section 19 */}
          <h2 id="section19" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">19. FINAL TERMS</h2>

          <p className="mb-6">
            These Terms, along with any HelloML ordering document such as master agreement, or as found on HelloML's website, make up the final, entire, and exclusive agreement between you and HelloML with respect to the subject matter hereof and supersede any prior agreements and discussions, both written and oral, with respect to such subject matter. No purchase order or other document issued by you in respect of our Services shall control.
          </p>

          {/* Section 20 */}
          <h2 id="section20" className="text-xl font-bold text-[#8B6F47] mt-12 mb-4">20. CONTACT US</h2>

          <p className="mb-8">
            HelloML welcomes comments, questions, concerns, or suggestions. Please send us any inquiries at <a href="mailto:noah@helloml.app?subject=Terms%20Inquiry" className="text-[#8B6F47] underline">noah@helloml.app</a>.
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="mt-12 pt-8 border-t border-[#E8DCC8]">
          <Link href="/" className="text-[#8B6F47] hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
