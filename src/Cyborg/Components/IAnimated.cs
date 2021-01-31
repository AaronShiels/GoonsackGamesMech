namespace Cyborg.Components
{
    public interface IAnimated : ISprite
    {
        string AnimationSet { get; }
        string Animation { get; set; }
        float AnimationElapsed { get; set; }
    }
}