import React from 'react';

import './SubmissionForm.scss';

// TODO: build script to submit to Github
export default function SubmissionForm() {
  return (
    <div className="SubmissionForm">
      <iframe
        title="submissionForm"
        src="https://docs.google.com/forms/d/e/1FAIpQLScqlfRF9F1QozvoMY4q1TdSdA8_9tG8g6TX1VjChLpXUUjwGg/viewform"
        width="100%"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
      >
        Loading...
      </iframe>
    </div>
  );
}
