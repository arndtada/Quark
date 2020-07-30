package vazkii.quark.world.module.underground;

import net.minecraftforge.common.BiomeDictionary.Type;
import vazkii.quark.base.module.LoadModule;
import vazkii.quark.base.module.ModuleCategory;
import vazkii.quark.world.config.UndergroundBiomeConfig;
import vazkii.quark.world.gen.underground.SandstoneUndergroundBiome;

@LoadModule(category = ModuleCategory.WORLD)
public class SandstoneUndergroundBiomeModule extends UndergroundBiomeModule {

	@Override
	protected UndergroundBiomeConfig getBiomeConfig() {
		return new UndergroundBiomeConfig(new SandstoneUndergroundBiome(), 80, Type.SANDY);
	}
	
	@Override
	protected String getBiomeName() {
		return "sandstone";
	}

}
