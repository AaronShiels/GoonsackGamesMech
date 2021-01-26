namespace Cyborg.Components
{
    public interface IAnimatedSprite : IBody
    {
        string AnimationSet { get; }
        string Animation { get; set; }
        float AnimationElapsed { get; set; }
    }
}