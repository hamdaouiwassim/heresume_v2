@extends('layouts.app')

@section('title', 'Terms of Service — HResume')
@section('meta_description', 'Terms of service for HResume.')
@section('page_name', 'terms')

@section('content')
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Legal</p>
        <h1>Terms of service</h1>
        <p>Last updated September 28, 2026</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container legal">
        <nav class="legal-toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            <li><a href="#acceptance">Acceptance of terms</a></li>
            <li><a href="#service">The service</a></li>
            <li><a href="#account">Your account</a></li>
            <li><a href="#content">Your content</a></li>
            <li><a href="#acceptable-use">Acceptable use</a></li>
            <li><a href="#availability">Availability and data loss</a></li>
            <li><a href="#liability">Limitation of liability</a></li>
            <li><a href="#changes">Changes</a></li>
            <li><a href="#contact">Contact</a></li>
          </ol>
        </nav>

        <div class="prose">
          <h2 id="acceptance">Acceptance of terms</h2>
          <p>By creating an account or using HResume, you agree to these terms. If you do not agree, please do not use the service.</p>

          <h2 id="service">The service</h2>
          <p>HResume lets you create, edit and download resumes using the templates provided. The service is currently offered free of charge. We may add, change or remove features over time.</p>

          <h2 id="account">Your account</h2>
          <ul>
            <li>You are responsible for the accuracy of the information you provide.</li>
            <li>You are responsible for keeping your password and device secure.</li>
            <li>You may delete your account at any time from the Account page.</li>
          </ul>

          <h2 id="content">Your content</h2>
          <p>You retain ownership of any content you enter into HResume. We do not claim any rights to your personal resume data.</p>

          <h2 id="acceptable-use">Acceptable use</h2>
          <p>You agree not to use the service for unlawful purposes, spam, or distribution of malicious material.</p>

          <h2 id="availability">Availability and data loss</h2>
          <p>We work to keep the service running reliably, but cannot guarantee uninterrupted uptime.</p>

          <h2 id="liability">Limitation of liability</h2>
          <p>To the maximum extent permitted by law, HResume is provided as is without warranties of any kind.</p>

          <h2 id="changes">Changes</h2>
          <p>We may modify these terms occasionally. Updates will be posted on this page.</p>

          <h2 id="contact">Contact</h2>
          <p>If you have any questions regarding these terms, please <a href="{{ route('contact.show') }}">contact us</a>.</p>
        </div>
      </div>
    </section>
  </main>
@endsection
