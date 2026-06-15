import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { Bot, Loader2 } from 'lucide-react'

export default function Analyzer() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cvFile, setCvFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
      setError('')
      toast.success('CV uploaded successfully')
    } else {
      setError('Please upload a PDF file')
    }
  }

  const handleAnalyze = async () => {
    if (!cvFile) return setError('Please upload your CV')
    if (!jobDescription.trim()) return setError('Please paste the job description')
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('cv', cvFile)
      formData.append('jobDescription', jobDescription)
      const { data } = await API.post('/applications/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data)
      toast.success('Analysis complete!')
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Make sure the AI service is running.')
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result ? (
    result.score >= 75 ? 'text-green-400' :
    result.score >= 55 ? 'text-blue-400' :
    result.score >= 35 ? 'text-amber-400' : 'text-red-400'
  ) : ''

  const ringColor = result ? (
    result.score >= 75 ? 'border-green-500' :
    result.score >= 55 ? 'border-blue-500' :
    result.score >= 35 ? 'border-amber-500' : 'border-red-500'
  ) : 'border-gray-700'

  const progressColor = result ? (
    result.score >= 75 ? 'bg-green-500' :
    result.score >= 55 ? 'bg-blue-500' :
    result.score >= 35 ? 'bg-amber-500' : 'bg-red-500'
  ) : ''

  const getScoreMessage = (score) => {
    if (score >= 75) return { msg: 'Excellent match! Your CV aligns very well.', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
    if (score >= 55) return { msg: 'Good match. A few improvements will help.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
    if (score >= 35) return { msg: 'Partial match. Several gaps to address.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
    return { msg: 'Low match. Consider major CV improvements.', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">AI Resume Analyzer</h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload your CV and paste a job description to get your match score
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Left */}
        <div className="space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Upload your CV</h3>
            <label className="block border-2 border-dashed border-gray-700 hover:border-violet-500 rounded-xl p-8 text-center cursor-pointer transition-colors">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              {cvFile ? (
                <div>
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-sm font-medium text-green-400">{cvFile.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Click to change file</div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Bot size={22} className="text-gray-500" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">Click to upload CV PDF</div>
                  <div className="text-xs text-gray-600 mt-1">PDF format only · Max 5MB</div>
                </div>
              )}
            </label>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Job description</h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here — requirements, responsibilities, skills needed..."
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-600"
            />
            <div className="text-xs text-gray-600 mt-1">{jobDescription.length} characters</div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                Analyzing your CV...
              </>
            ) : (
              <>
                <Bot size={16} className="text-white" />
                Analyze match score
              </>
            )}
          </button>
        </div>

        {/* Right — Results */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Analysis results</h3>

          {!result && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot size={28} className="text-gray-600" />
              </div>
              <div className="text-gray-600 text-sm">
                Upload your CV and paste a job description, then click analyze
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-400 text-sm">Analyzing your CV...</div>
            </div>
          )}

          {result && (
            <div className="space-y-5">

              <div className="text-center">
                <div className={`w-24 h-24 rounded-full border-4 ${ringColor} flex flex-col items-center justify-center mx-auto mb-3`}>
                  <div className={`text-2xl font-bold ${scoreColor}`}>{result.score}%</div>
                  <div className="text-xs text-gray-500">match</div>
                </div>
                <div className={`text-sm font-semibold ${scoreColor}`}>{result.rating}</div>
              </div>

              {(() => {
                const { msg, color, bg } = getScoreMessage(result.score)
                return (
                  <div className={`border rounded-lg px-4 py-3 text-xs ${bg} ${color}`}>
                    {msg}
                  </div>
                )
              })()}

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>

              {result.found_keywords?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    ✅ Keywords found in your CV
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.found_keywords.map(kw => (
                      <span key={kw} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.missing_keywords?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    ❌ Missing from your CV
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords.map(kw => (
                      <span key={kw} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.missing_keywords?.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    🔧 How to fix these gaps
                  </div>
                  <div className="space-y-2.5">
                    {result.missing_keywords.slice(0, 4).map(kw => (
                      <div key={kw} className="flex gap-2 text-xs text-gray-400">
                        <span className="text-amber-400 flex-shrink-0 mt-0.5">→</span>
                        <span>
                          Add <span className="text-white font-medium">{kw}</span> to your CV by mentioning any projects, courses, or experience where you used it.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    💡 Improvement suggestions
                  </div>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-violet-500/20 bg-violet-500/5 rounded-xl p-4">
                <div className="text-xs font-semibold text-violet-400 mb-3">📝 General CV tips</div>
                <div className="space-y-2">
                  {[
                    'Use numbers to quantify achievements (e.g. "Improved accuracy by 15%")',
                    'Mirror exact keywords from the job description in your CV',
                    'Keep your CV to 1-2 pages with clear section headings',
                    'Put your most relevant experience and skills at the top',
                    'Include links to GitHub, portfolio, or LinkedIn',
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-400">
                      <span className="text-violet-400 flex-shrink-0">•</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{result.cv_word_count}</div>
                  <div className="text-xs text-gray-500">CV words</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{result.jd_word_count}</div>
                  <div className="text-xs text-gray-500">JD words</div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}