using System.Text.Json.Serialization;

namespace Cyborg.ContentPipeline.Animations
{
    public class AnimationJson
    {
        [JsonPropertyName("frame_rate")]
        public int FrameRate { get; set; }
        [JsonPropertyName("frame_count")]
        public int FrameCount { get; set; }
        public bool Repeat { get; set; }
    }
}