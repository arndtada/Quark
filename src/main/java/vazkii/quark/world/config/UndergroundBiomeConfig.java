package vazkii.quark.world.config;

import net.minecraftforge.common.BiomeDictionary;
import vazkii.quark.base.world.config.ClusterSizeConfig;
import vazkii.quark.world.gen.underground.UndergroundBiome;

public class UndergroundBiomeConfig extends ClusterSizeConfig {

	public final UndergroundBiome biomeObj;

	public UndergroundBiomeConfig(UndergroundBiome biomeObj, int rarity, boolean isBlacklist, BiomeDictionary.Type... types) {
		super(rarity, 26, 14, 14, 6, isBlacklist, types);
		this.biomeObj = biomeObj;
	}

	public UndergroundBiomeConfig(UndergroundBiome biomeObj, int rarity, BiomeDictionary.Type... types) {
		this(biomeObj, rarity, false, types);
	}
	
	public UndergroundBiomeConfig setDefaultSize(int horizontal, int vertical, int horizontalVariation, int verticalVariation) {
		this.horizontalSize = horizontal;
		this.verticalSize = vertical;
		this.horizontalVariation = horizontalVariation;
		this.verticalVariation = verticalVariation;
		return this;
	}

}
