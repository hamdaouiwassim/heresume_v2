@extends('layouts.editor')

@section('title', $resume->title . ' — Editor — HResume')

@section('content')
  <header class="editor-topbar">
    <a href="{{ route('resumes.index') }}" class="btn btn-ghost btn-sm">
      <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" style="margin-right: 4px;"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
      Back
    </a>
    <input class="title-input" id="titleInput" value="{{ $resume->title }}" aria-label="Resume name" autocomplete="off">
    <span class="save-status" id="saveStatus">Saved</span>
    <div class="spacer"></div>
    <button class="btn btn-secondary btn-sm mobile-only" id="togglePreview">Preview</button>
    <button class="btn btn-primary btn-sm" id="downloadBtn">
      <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" style="margin-right: 6px;"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      Download PDF
    </button>
  </header>

  <div class="editor">
    <aside class="editor-panel">
      <nav class="tabs" role="tablist">
        <button class="tab is-active" role="tab" data-tab="details">Details</button>
        <button class="tab" role="tab" data-tab="experience">Experience</button>
        <button class="tab" role="tab" data-tab="education">Education</button>
        <button class="tab" role="tab" data-tab="skills">Skills</button>
        <button class="tab" role="tab" data-tab="extras">Extras</button>
        <button class="tab" role="tab" data-tab="design">Design</button>
      </nav>

      <div class="panel-scroll" id="panelScroll">
        <!-- Details -->
        <section class="panel" data-panel="details">
          <h2>Personal details</h2>
          <p>How employers will contact you.</p>
          <div class="form">
            <div class="photo-field">
              <div class="photo-preview" id="photoPreview"></div>
              <div>
                <span class="label">Photo</span>
                <p class="field-hint">Shown on templates with a photo (Vancouver, Toronto, Professional, Creative, Fresh, etc.).</p>
                <div class="photo-actions">
                  <label class="btn btn-secondary btn-sm">
                    <span id="photoButtonLabel">Upload photo</span>
                    <input type="file" id="photoInput" accept="image/png, image/jpeg, image/webp" hidden>
                  </label>
                  <button type="button" class="btn btn-ghost btn-sm" id="photoRemove" hidden>Remove</button>
                </div>
              </div>
            </div>
            <div class="grid-2">
              <div class="field">
                <label for="fullName">Full name</label>
                <input id="fullName" data-bind="personal.fullName">
              </div>
              <div class="field">
                <label for="jobTitle">Job title</label>
                <input id="jobTitle" data-bind="personal.jobTitle" placeholder="e.g. Marketing Manager">
              </div>
              <div class="field">
                <label for="pEmail">Email</label>
                <input id="pEmail" type="email" data-bind="personal.email">
              </div>
              <div class="field">
                <label for="phone">Phone</label>
                <input id="phone" type="tel" data-bind="personal.phone">
              </div>
              <div class="field">
                <label for="location">Location</label>
                <input id="location" data-bind="personal.location" placeholder="City, Country">
              </div>
              <div class="field">
                <label for="website">Website</label>
                <input id="website" data-bind="personal.website">
              </div>
            </div>
            <div class="field">
              <label for="summary">Professional summary</label>
              <textarea id="summary" data-bind="summary" rows="5" placeholder="Two or three sentences about your experience and what you are looking for."></textarea>
            </div>
          </div>

          <div class="panel-group">
            <h3>Social links</h3>
            <p>LinkedIn, GitHub, portfolio or other profiles.</p>
            <div class="entries" data-list="socials"></div>
            <button class="btn btn-secondary btn-block" data-add="socials">Add link</button>
          </div>
        </section>

        <!-- Experience -->
        <section class="panel" data-panel="experience" hidden>
          <h2>Experience</h2>
          <p>Start with your most recent position. Put each achievement on its own line.</p>
          <div class="entries" data-list="experience"></div>
          <button class="btn btn-secondary btn-block" data-add="experience">Add position</button>
        </section>

        <!-- Education -->
        <section class="panel" data-panel="education" hidden>
          <h2>Education</h2>
          <p>Degrees, diplomas and relevant courses.</p>
          <div class="entries" data-list="education"></div>
          <button class="btn btn-secondary btn-block" data-add="education">Add education</button>
        </section>

        <!-- Skills -->
        <section class="panel" data-panel="skills" hidden>
          <h2>Skills</h2>
          <p>Press Enter after each item.</p>
          <div class="form">
            <div class="field">
              <span class="label">Skills</span>
              <div class="tag-input" data-tags="skills">
                <input type="text" placeholder="e.g. Project management, or Figma 4/5" aria-label="Add a skill">
              </div>
            </div>
            <div class="field">
              <span class="label">Languages</span>
              <div class="tag-input" data-tags="languages">
                <input type="text" placeholder="e.g. French — Fluent, or French 8/10" aria-label="Add a language">
              </div>
            </div>
          </div>
        </section>

        <!-- Extras -->
        <section class="panel" data-panel="extras" hidden>
          <h2>Extras</h2>
          <p>Optional sections. Anything left empty is not shown on your resume.</p>

          <div class="panel-group">
            <h3>Projects</h3>
            <div class="entries" data-list="projects"></div>
            <button class="btn btn-secondary btn-block" data-add="projects">Add project</button>
          </div>

          <div class="panel-group">
            <h3>Certificates</h3>
            <div class="entries" data-list="certificates"></div>
            <button class="btn btn-secondary btn-block" data-add="certificates">Add certificate</button>
          </div>

          <div class="panel-group">
            <h3>Hobbies</h3>
            <div class="tag-input" data-tags="hobbies">
              <input type="text" placeholder="e.g. Photography" aria-label="Add a hobby">
            </div>
          </div>
        </section>

        <!-- Design -->
        <section class="panel" data-panel="design" hidden>
          <h2>Design</h2>
          <p>Change the look at any time. Your content stays the same.</p>
          <div class="design-group">
            <span class="label">Template</span>
            <div class="template-picker" id="templatePicker"></div>
          </div>
          <div class="design-group">
            <span class="label">Accent color</span>
            <div class="swatches" id="swatches"></div>
          </div>
        </section>
      </div>

      <div class="panel-footer">
        <button class="btn btn-ghost btn-sm" id="prevTab">Previous</button>
        <button class="btn btn-secondary btn-sm" id="nextTab">Next</button>
      </div>
    </aside>

    <section class="editor-preview" id="previewPane">
      <div class="page-notice" id="pageNotice" hidden>
        <span id="pageCount"></span>
        <button type="button" class="btn btn-secondary btn-sm" id="pageBreaksButton" aria-expanded="false" aria-controls="pageBreaksMenu">Page breaks</button>
        <div class="page-breaks-menu" id="pageBreaksMenu" hidden>
          <p>Start a section on a new page</p>
          <div class="page-breaks-list" id="pageBreaksList"></div>
        </div>
      </div>
      <div class="preview-frame" id="previewFrame"></div>
    </section>
  </div>
@endsection

@push('scripts')
  <script>
    window.LARAVEL_RESUME = {
      id: {{ $resume->id }},
      title: @json($resume->title),
      template: @json($resume->template),
      color: @json($resume->color),
      data: @json($resume->data ?? new stdClass()),
      updated_at: @json($resume->updated_at)
    };
    window.SAVE_URL = "{{ route('resumes.update', $resume) }}";
    window.PHOTO_URL = "{{ route('resumes.photo', $resume) }}";
    window.CSRF_TOKEN = "{{ csrf_token() }}";
  </script>
  <script src="{{ asset('js/editor.js') }}"></script>
  <script>
    // Wire up Laravel backend auto-saving
    (function () {
      let saveTimer = null;
      const statusEl = document.getElementById('saveStatus');

      window.saveToLaravel = function () {
        if (!window.currentResume) return;
        if (statusEl) statusEl.textContent = 'Saving...';

        clearTimeout(saveTimer);
        saveTimer = setTimeout(async () => {
          try {
            const res = await fetch(window.SAVE_URL, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': window.CSRF_TOKEN
              },
              body: JSON.stringify({
                title: window.currentResume.title,
                template: window.currentResume.template,
                color: window.currentResume.color,
                data: window.currentResume.data
              })
            });
            if (res.ok) {
              if (statusEl) statusEl.textContent = 'Saved';
            } else {
              if (statusEl) statusEl.textContent = 'Error saving';
            }
          } catch (e) {
            if (statusEl) statusEl.textContent = 'Saved locally';
          }
        }, 600);
      };

      // Handle photo upload directly to Laravel storage
      const photoInput = document.getElementById('photoInput');
      if (photoInput) {
        photoInput.addEventListener('change', async (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append('photo', file);

          if (statusEl) statusEl.textContent = 'Uploading photo...';

          try {
            const res = await fetch(window.PHOTO_URL, {
              method: 'POST',
              headers: {
                'X-CSRF-TOKEN': window.CSRF_TOKEN,
                'Accept': 'application/json'
              },
              body: formData
            });
            const data = await res.json();
            if (data.success && data.url) {
              if (window.currentResume && window.currentResume.data) {
                window.currentResume.data.personal.photo = data.url;
                if (typeof window.renderAll === 'function') window.renderAll();
              }
              if (statusEl) statusEl.textContent = 'Saved';
            }
          } catch (err) {
            console.error('Photo upload failed', err);
          }
        });
      }
    })();
  </script>
@endpush
