import { useState } from 'react';
import './ProjectForm.css';

const NAME_MIN = 4;
const PROMPT_MIN = 15;

export default function ProjectForm({ onSubmit, disabled }) {
  const [projectName, setProjectName] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [touched, setTouched] = useState(false);

  const nameError =
    projectName.trim().length > 0 && projectName.trim().length < NAME_MIN
      ? `Project name needs at least ${NAME_MIN} characters.`
      : null;

  const promptError =
    userPrompt.trim().length > 0 && userPrompt.trim().length < PROMPT_MIN
      ? `Describe the project in at least ${PROMPT_MIN} characters.`
      : null;

  const isValid =
    projectName.trim().length >= NAME_MIN && userPrompt.trim().length >= PROMPT_MIN;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || disabled) return;
    onSubmit({ projectName: projectName.trim(), userPrompt: userPrompt.trim() });
  };

  return (
    <form className="project-form" onSubmit={handleSubmit} noValidate>
      <div className="project-form__field">
        <label htmlFor="projectName">Project name</label>
        <input
          id="projectName"
          type="text"
          placeholder="e.g. ShiftSync — team scheduling app"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={disabled}
          aria-invalid={touched && !!nameError}
          aria-describedby="projectName-hint"
        />
        <div id="projectName-hint" className="project-form__hint">
          {touched && nameError ? (
            <span className="project-form__error">{nameError}</span>
          ) : (
            `Minimum ${NAME_MIN} characters`
          )}
        </div>
      </div>

      <div className="project-form__field">
        <label htmlFor="userPrompt">Describe the software idea</label>
        <textarea
          id="userPrompt"
          rows={7}
          placeholder="What does it do, who is it for, what are the core features and constraints? The more specific, the better the generated architecture."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={disabled}
          aria-invalid={touched && !!promptError}
          aria-describedby="userPrompt-hint"
        />
        <div id="userPrompt-hint" className="project-form__hint">
          {touched && promptError ? (
            <span className="project-form__error">{promptError}</span>
          ) : (
            `${userPrompt.trim().length} / ${PROMPT_MIN} minimum characters`
          )}
        </div>
      </div>

      <button type="submit" className="project-form__submit" disabled={disabled}>
        {disabled ? 'Drafting…' : 'Generate architecture'}
      </button>
    </form>
  );
}
