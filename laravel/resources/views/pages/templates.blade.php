@extends('layouts.app')

@section('title', 'Resume templates — HResume')
@section('meta_description', 'Browse 33 professional resume templates. Preview each design in different colors and start your resume in one click.')
@section('page_name', 'templates')

@section('content')
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Templates</p>
        <h1>Resume templates</h1>
        <p>Pick a design to start with. You can switch templates and colors at any time without losing your content.</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="filter-tabs" role="group" aria-label="Filter templates" id="filters">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          <button type="button" data-filter="one" aria-pressed="false">One column</button>
          <button type="button" data-filter="two" aria-pressed="false">Two columns</button>
          <button type="button" data-filter="photo" aria-pressed="false">With photo</button>
        </div>

        <div class="template-list" id="templateList"></div>
      </div>
    </section>
  </main>
@endsection

@push('scripts')
  <script>
    window.LARAVEL_AUTH = {{ auth()->check() ? 'true' : 'false' }};
    window.CREATE_RESUME_URL = "{{ route('resumes.create') }}";
  </script>
  <script src="{{ asset('js/templates.js') }}"></script>
  <script>
    // Enhance "Use Template" buttons to redirect directly to Laravel resume creation
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-use-template], [data-action="use-template"]');
      if (btn) {
        const id = btn.dataset.useTemplate || btn.dataset.id;
        if (id) {
          e.preventDefault();
          window.location.href = `${window.CREATE_RESUME_URL}?template=${encodeURIComponent(id)}`;
        }
      }
    });
  </script>
@endpush
