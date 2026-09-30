import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getHistory, deleteHistoryItem } from '../../services/historyService.js';
import InterviewCard from '../../components/InterviewCard';
import {
  BsChatSquareTextFill,
  BsCheckCircleFill,
  BsTrophyFill,
  BsPlayCircleFill,
  BsChatSquareText,
} from 'react-icons/bs';
import toast from 'react-hot-toast';
import './index.css';

function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [allInterviews, setAllInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory(1, 20);
        const entries = data?.entries || [];
        setAllInterviews(entries);
        setRecentInterviews(entries.slice(0, 3));
      } catch (error) {
        toast.error('Failed to load interviews.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this interview from your history?');
    if (!confirmed) return;

    try {
      await deleteHistoryItem(id);
      const nextInterviews = allInterviews.filter((interview) => interview._id !== id);
      setAllInterviews(nextInterviews);
      setRecentInterviews(nextInterviews.slice(0, 3));
      toast.success('Interview deleted');
    } catch (error) {
      toast.error('Could not delete the interview.');
    }
  };

  const handleCardClick = (interview) => {
    if (interview.status === 'completed') {
      navigate(`/feedback/${interview._id}`);
      return;
    }

    navigate(`/interview/${interview._id}`);
  };

  const completedCount = allInterviews.filter((interview) => interview.status === 'completed').length;
  const completedScores = allInterviews.filter(
    (interview) => interview.status === 'completed' && interview.overallScore !== null && interview.overallScore !== undefined
  );
  const avgScore =
    completedScores.length > 0
      ? Math.round(
          completedScores.reduce((total, interview) => total + Number(interview.overallScore), 0) /
            completedScores.length
        )
      : 0;

  return (
    <div className="home-page">
      <div className="home-welcome">
        <h1 className="home-welcome-heading">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="home-welcome-subtitle">
          Practice makes perfect. Start a mock interview and get AI-powered
          feedback.
        </p>
      </div>

      <div className="home-stats-row">
        <div className="home-stat-card shadow-sm">
          <BsChatSquareTextFill className="home-stat-icon" />
          <span className="home-stat-number">{allInterviews.length}</span>
          <span className="home-stat-label">Interviews</span>
        </div>
        <div className="home-stat-card shadow-sm">
          <BsCheckCircleFill className="home-stat-icon" />
          <span className="home-stat-number">{completedCount}</span>
          <span className="home-stat-label">Completed</span>
        </div>
        <div className="home-stat-card shadow-sm">
          <BsTrophyFill className="home-stat-icon" />
          <span className="home-stat-number">{avgScore}</span>
          <span className="home-stat-label">Avg Score</span>
        </div>
      </div>

      <div className="home-cta-container">
        <button className="home-start-btn" onClick={() => navigate('/setup')}>
          <BsPlayCircleFill className="home-start-icon" />
          Start New Interview
        </button>
      </div>

      <div className="home-recent-section">
        <div className="home-section-header">
          <h2 className="home-section-heading">Recent Interviews</h2>
          {recentInterviews.length > 0 && (
            <button className="home-view-all-btn" onClick={() => navigate('/history')}>
              View All
            </button>
          )}
        </div>

        {loading ? (
          <div className="home-loading-state">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="home-loading-text">Loading interviews...</p>
          </div>
        ) : recentInterviews.length === 0 ? (
          <div className="home-empty-state">
            <BsChatSquareText className="home-empty-icon" />
            <h3 className="home-empty-heading">No interviews yet</h3>
            <p className="home-empty-text">
              Start your first mock interview to see it here.
            </p>
            <button className="home-empty-cta-btn" onClick={() => navigate('/setup')}>
              <BsPlayCircleFill className="home-start-icon" />
              Start Interview
            </button>
          </div>
        ) : (
          <div className="home-interviews-grid">
            {recentInterviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                onClick={() => handleCardClick(interview)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;