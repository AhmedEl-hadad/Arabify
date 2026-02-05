import React from 'react';
import '../App.css'; // Ensure we have the CSS for the scorecard

const ProjectScoreCard = ({ score, totalScoreLabel }) => {
    // Color logic
    const strokeColor = score === 100 ? "#27c93f" : score >= 70 ? "#ffbd2e" : "#ff5f56";
    
    // Circle math (r=15.9155 for circumference 100)
    // stroke-dasharray="current, total" => "score, 100"
    const dashArray = `${score}, 100`;

    return (
        <div className="project-score-container">
            <h3 className="score-title">{totalScoreLabel}</h3>
            <div className="circular-chart-wrapper" style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                        strokeDasharray={dashArray}
                        stroke={strokeColor}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage-text">
                        {score}%
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default ProjectScoreCard;
