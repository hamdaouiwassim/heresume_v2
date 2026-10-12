@extends('layouts.app')

@section('title', 'Contact — HResume')
@section('meta_description', 'Get in touch with the HResume team.')
@section('page_name', 'contact')

@section('content')
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p>Questions, feedback or a problem with your resume? Send us a message.</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container contact">
        <div class="contact-info">
          <div>
            <h2>Email</h2>
            <p><a href="mailto:hello@hresume.app">hello@hresume.app</a></p>
          </div>
          <div>
            <h2>Common questions</h2>
            <p>Many answers are in our <a href="{{ route('home') }}#faq">FAQ</a>.</p>
          </div>
          <div>
            <h2>Privacy</h2>
            <p>Read how we handle your data in our <a href="{{ route('privacy') }}">privacy policy</a>.</p>
          </div>
        </div>

        <div class="card contact-card">
          <form action="{{ route('contact.send') }}" method="POST" class="form">
            @csrf

            <div class="grid-2">
              <div class="field">
                <label for="name">Name</label>
                <input id="name" name="name" value="{{ old('name', auth()->user()?->name) }}" required>
              </div>
              <div class="field">
                <label for="email">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email', auth()->user()?->email) }}" required>
              </div>
            </div>
            <div class="field">
              <label for="subject">Subject</label>
              <input id="subject" name="subject" value="{{ old('subject') }}" placeholder="What is this about?">
            </div>
            <div class="field">
              <label for="message">Message</label>
              <textarea id="message" name="message" rows="5" required placeholder="Write your message here...">{{ old('message') }}</textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">Send message</button>
          </form>
        </div>
      </div>
    </section>
  </main>
@endsection
