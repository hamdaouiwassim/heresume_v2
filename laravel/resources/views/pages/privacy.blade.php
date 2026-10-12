@extends('layouts.app')

@section('title', 'Privacy Policy — HResume')
@section('meta_description', 'Privacy policy for HResume.')
@section('page_name', 'privacy')

@section('content')
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Legal</p>
        <h1>Privacy policy</h1>
        <p>Last updated September 28, 2026</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container legal">
        <nav class="legal-toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#data-we-store">Data we store</a></li>
            <li><a href="#where">Where your data is kept</a></li>
            <li><a href="#third-parties">Third-party services</a></li>
            <li><a href="#contact-form">Contact form</a></li>
            <li><a href="#your-rights">Your choices</a></li>
            <li><a href="#changes">Changes</a></li>
            <li><a href="#contact">Contact</a></li>
          </ol>
        </nav>

        <div class="prose">
          <h2 id="overview">Overview</h2>
          <p>This policy explains what information HResume handles when you use the website and how it is used. We collect only what is needed to let you build and download your resume.</p>

          <h2 id="data-we-store">Data we store</h2>
          <p>When you use HResume, the following information is stored:</p>
          <ul>
            <li><strong>Account details:</strong> your name, email address and a hashed version of your password.</li>
            <li><strong>Resume content:</strong> everything you enter in the editor, such as your contact details, work history, education and skills.</li>
            <li><strong>Preferences:</strong> the template and color you choose for each resume.</li>
          </ul>
          <p>We do not use advertising trackers, and we do not sell your information.</p>

          <h2 id="where">Where your data is kept</h2>
          <p>Your account and resumes are stored securely on our encrypted database. You can export or delete your information at any time.</p>

          <h2 id="third-parties">Third-party services</h2>
          <p>We use minimal external infrastructure only to deliver the application reliably.</p>

          <h2 id="contact-form">Contact form</h2>
          <p>Messages sent through our contact form are stored so our team can answer your enquiry.</p>

          <h2 id="your-rights">Your choices</h2>
          <p>You can delete individual resumes or your entire account at any time from the account settings page.</p>

          <h2 id="changes">Changes</h2>
          <p>Any updates to this policy will be posted on this page with an updated date.</p>

          <h2 id="contact">Contact</h2>
          <p>For questions regarding privacy, please <a href="{{ route('contact.show') }}">contact us</a>.</p>
        </div>
      </div>
    </section>
  </main>
@endsection
